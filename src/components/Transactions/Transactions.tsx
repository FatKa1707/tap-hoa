import { useState, FormEvent } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Select, Modal, Textarea, CurrencyInput } from '../UI';
import { TransactionType } from '../../types';
import { formatCurrency, formatDateTime as formatDate } from '../../utils/format';
import './Transactions.css';

export function Transactions() {
    const { products, transactions, addTransaction, deleteTransaction } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        type: 'sell' as TransactionType,
        productId: '',
        quantity: '',
        unitPrice: '',
        note: ''
    });

    // Stats
    const totalBuy = transactions
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalSell = transactions
        .filter(t => t.type === 'sell')
        .reduce((sum, t) => sum + t.totalAmount, 0);

    const openAddModal = () => {
        setFormData({
            type: 'sell',
            productId: products[0]?.id || '',
            quantity: '',
            unitPrice: '',
            note: ''
        });
        setShowModal(true);
    };

    const handleProductChange = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setFormData({
                ...formData,
                productId,
                unitPrice: formData.type === 'sell'
                    ? product.price.toString()
                    : product.costPrice.toString()
            });
        }
    };

    const handleTypeChange = (type: TransactionType) => {
        const product = products.find(p => p.id === formData.productId);
        setFormData({
            ...formData,
            type,
            unitPrice: product
                ? (type === 'sell' ? product.price : product.costPrice).toString()
                : ''
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const product = products.find(p => p.id === formData.productId);
        if (!product) return;

        addTransaction({
            productId: formData.productId,
            productName: product.name,
            type: formData.type,
            quantity: parseInt(formData.quantity) || 0,
            unitPrice: parseFloat(formData.unitPrice) || 0,
            note: formData.note
        });

        setShowModal(false);
    };

    const handleDelete = () => {
        if (deleteConfirm) {
            deleteTransaction(deleteConfirm);
            setDeleteConfirm(null);
        }
    };



    return (
        <div className="transactions-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý giao dịch</h1>
                    <p className="page-description">Theo dõi mua vào, bán ra và lịch sử giao dịch</p>
                </div>
                <Button onClick={openAddModal} disabled={products.length === 0}>
                    ➕ Thêm giao dịch
                </Button>
            </div>

            {/* Stats */}
            <div className="transaction-stats">
                <div className="trans-stat">
                    <div className="trans-stat-label">Tổng nhập hàng</div>
                    <div className="trans-stat-value buy">{formatCurrency(totalBuy)}</div>
                </div>
                <div className="trans-stat">
                    <div className="trans-stat-label">Tổng bán ra</div>
                    <div className="trans-stat-value sell">{formatCurrency(totalSell)}</div>
                </div>
                <div className="trans-stat">
                    <div className="trans-stat-label">Số giao dịch</div>
                    <div className="trans-stat-value">{transactions.length}</div>
                </div>
            </div>

            {/* Transactions table */}
            {transactions.length > 0 ? (
                <div className="transactions-table-wrapper">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Loại</th>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                                <th>Ghi chú</th>
                                <th>Thời gian</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>
                                        <span className={`type-badge ${transaction.type}`}>
                                            {transaction.type === 'buy' ? 'Nhập' : 'Bán'}
                                        </span>
                                    </td>
                                    <td>{transaction.productName}</td>
                                    <td>{transaction.quantity}</td>
                                    <td>{formatCurrency(transaction.unitPrice)}</td>
                                    <td className={`amount-cell ${transaction.type}`}>
                                        {formatCurrency(transaction.totalAmount)}
                                    </td>
                                    <td className="transaction-note">{transaction.note || '-'}</td>
                                    <td className="transaction-date">{formatDate(transaction.createdAt)}</td>
                                    <td>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(transaction.id)}
                                        >
                                            🗑️
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="transactions-empty">
                    <div className="transactions-empty-icon">💰</div>
                    <h3 className="transactions-empty-title">Chưa có giao dịch nào</h3>
                    <p className="transactions-empty-text">
                        {products.length === 0
                            ? 'Hãy thêm sản phẩm trước khi tạo giao dịch'
                            : 'Bấm "Thêm giao dịch" để bắt đầu'
                        }
                    </p>
                    {products.length > 0 && (
                        <Button onClick={openAddModal}>➕ Thêm giao dịch đầu tiên</Button>
                    )}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Thêm giao dịch mới"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Huỷ
                        </Button>
                        <Button onClick={handleSubmit}>
                            Thêm giao dịch
                        </Button>
                    </>
                }
            >
                <form className="transaction-form" onSubmit={handleSubmit}>
                    {/* Type selector */}
                    <div className="input-group">
                        <label className="input-label">Loại giao dịch</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-option ${formData.type === 'sell' ? 'active sell' : ''}`}
                                onClick={() => handleTypeChange('sell')}
                            >
                                <span className="type-option-icon">💵</span>
                                <span className="type-option-label">Bán ra</span>
                            </button>
                            <button
                                type="button"
                                className={`type-option ${formData.type === 'buy' ? 'active buy' : ''}`}
                                onClick={() => handleTypeChange('buy')}
                            >
                                <span className="type-option-icon">📥</span>
                                <span className="type-option-label">Nhập hàng</span>
                            </button>
                        </div>
                    </div>

                    <Select
                        label="Sản phẩm"
                        value={formData.productId}
                        onChange={e => handleProductChange(e.target.value)}
                        required
                    >
                        <option value="">Chọn sản phẩm</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} (Tồn: {product.quantity} {product.unit})
                            </option>
                        ))}
                    </Select>

                    <div className="form-row">
                        <Input
                            type="number"
                            label="Số lượng"
                            placeholder="VD: 10"
                            value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            min="1"
                            required
                        />

                        <CurrencyInput
                            label="Đơn giá (VNĐ)"
                            placeholder="VD: 25.000"
                            value={formData.unitPrice}
                            onChange={value => setFormData({ ...formData, unitPrice: value })}
                            required
                        />
                    </div>

                    <Textarea
                        label="Ghi chú (tuỳ chọn)"
                        placeholder="VD: Khách quen, giảm giá..."
                        value={formData.note}
                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                    />
                </form>
            </Modal>

            {/* Delete confirmation */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xác nhận xoá"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                            Huỷ
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Xoá
                        </Button>
                    </>
                }
            >
                <p>Bạn có chắc chắn muốn xoá giao dịch này?</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Số lượng tồn kho sẽ được điều chỉnh lại.
                </p>
            </Modal>
        </div>
    );
}

export default Transactions;
