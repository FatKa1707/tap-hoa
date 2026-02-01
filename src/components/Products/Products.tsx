import { useState, FormEvent } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Select, Modal, CurrencyInput } from '../UI';
import { Product, CATEGORIES, UNITS } from '../../types';
import { formatCurrency } from '../../utils/format';
import './Products.css';

export function Products() {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        category: CATEGORIES[0],
        unit: UNITS[0]
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            sellingPrice: '',
            costPrice: '',
            quantity: '',
            category: CATEGORIES[0],
            unit: UNITS[0]
        });
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sellingPrice: product.sellingPrice.toString(),
            costPrice: product.costPrice.toString(),
            quantity: product.quantity.toString(),
            category: product.category,
            unit: product.unit
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
            costPrice: parseFloat(formData.costPrice) || 0,
            quantity: parseInt(formData.quantity) || 0,
            category: formData.category,
            unit: formData.unit
        };

        if (editingProduct) {
            await updateProduct(editingProduct.id, productData);
        } else {
            await addProduct(productData);
        }

        setShowModal(false);
    };

    const handleDelete = async () => {
        if (deleteConfirm) {
            await deleteProduct(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };



    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý hàng hoá</h1>
                    <p className="page-description">Thêm, sửa, xoá sản phẩm trong kho</p>
                </div>
                <Button onClick={openAddModal}>
                    ➕ Thêm sản phẩm
                </Button>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <Input
                        className="search-input"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <Select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Products grid */}
            {filteredProducts.length > 0 ? (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-header">
                                <h3 className="product-name">{product.name}</h3>
                                <span className="product-category">{product.category}</span>
                            </div>

                            <div className="product-info">
                                <div className="product-row">
                                    <span className="product-label">Tồn kho:</span>
                                    <span className={`product-value ${product.quantity <= 5 ? 'low-stock' : 'in-stock'}`}>
                                        {product.quantity} {product.unit}
                                    </span>
                                </div>
                            </div>

                            <div className="product-prices">
                                <div className="price-item">
                                    <span className="price-label">Giá bán</span>
                                    <span className="price-value sell">{formatCurrency(product.sellingPrice)}</span>
                                </div>
                                <div className="price-item">
                                    <span className="price-label">Giá nhập</span>
                                    <span className="price-value cost">{formatCurrency(product.costPrice)}</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>
                                    ✏️ Sửa
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(product)}>
                                    🗑️ Xoá
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="products-empty">
                    <div className="products-empty-icon">📦</div>
                    <h3 className="products-empty-title">
                        {search || categoryFilter ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                    </h3>
                    <p className="products-empty-text">
                        {search || categoryFilter
                            ? 'Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc'
                            : 'Bấm "Thêm sản phẩm" để bắt đầu'
                        }
                    </p>
                    {!search && !categoryFilter && (
                        <Button onClick={openAddModal}>➕ Thêm sản phẩm đầu tiên</Button>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Huỷ
                        </Button>
                        <Button onClick={handleSubmit}>
                            {editingProduct ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </>
                }
            >
                <form className="product-form" onSubmit={handleSubmit}>
                    <Input
                        label="Tên sản phẩm"
                        placeholder="VD: Mì gói Hảo Hảo"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="form-row">
                        <Select
                            label="Danh mục"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>

                        <Select
                            label="Đơn vị"
                            value={formData.unit}
                            onChange={e => setFormData({ ...formData, unit: e.target.value })}
                        >
                            {UNITS.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="form-row">
                        <CurrencyInput
                            label="Giá bán (VNĐ)"
                            placeholder="VD: 25.000"
                            value={formData.sellingPrice}
                            onChange={value => setFormData({ ...formData, sellingPrice: value })}
                            required
                        />

                        <CurrencyInput
                            label="Giá nhập (VNĐ)"
                            placeholder="VD: 20.000"
                            value={formData.costPrice}
                            onChange={value => setFormData({ ...formData, costPrice: value })}
                            required
                        />
                    </div>

                    <Input
                        type="number"
                        label="Số lượng ban đầu"
                        placeholder="VD: 100"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        min="0"
                        required
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
                <p>
                    Bạn có chắc chắn muốn xoá sản phẩm <strong>"{deleteConfirm?.name}"</strong>?
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Hành động này không thể hoàn tác.
                </p>
            </Modal>
        </div>
    );
}

export default Products;
