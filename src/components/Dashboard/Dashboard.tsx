import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/format';
import './Dashboard.css';

export function Dashboard() {
    const { products, transactions } = useStore();

    // Calculate stats
    const totalRevenue = transactions
        .filter(t => t.type === 'sell')
        .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + t.totalAmount, 0);

    const profit = totalRevenue - totalExpense;

    const lowStockProducts = products.filter(p => p.quantity <= 5);
    const recentTransactions = transactions.slice(0, 5);



    return (
        <div className="dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tổng quan</h1>
                    <p className="page-description">Theo dõi hoạt động kinh doanh của bạn</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon revenue">💵</div>
                    </div>
                    <div className="stat-label">Doanh thu</div>
                    <div className="stat-value positive">{formatCurrency(totalRevenue)}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon expense">💸</div>
                    </div>
                    <div className="stat-label">Chi phí nhập hàng</div>
                    <div className="stat-value negative">{formatCurrency(totalExpense)}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon profit">📈</div>
                    </div>
                    <div className="stat-label">Lợi nhuận</div>
                    <div className={`stat-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(profit)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon products">📦</div>
                    </div>
                    <div className="stat-label">Tổng sản phẩm</div>
                    <div className="stat-value">{products.length}</div>
                </div>
            </div>

            {/* Dashboard sections */}
            <div className="dashboard-grid">
                {/* Low stock products */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            ⚠️ Sản phẩm sắp hết hàng
                        </h3>
                    </div>
                    <div className="section-content">
                        {lowStockProducts.length > 0 ? (
                            <div className="low-stock-list">
                                {lowStockProducts.map(product => (
                                    <div key={product.id} className="low-stock-item">
                                        <span className="low-stock-name">{product.name}</span>
                                        <span className="low-stock-quantity">
                                            Còn {product.quantity} {product.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">✅</div>
                                <p className="empty-state-text">Không có sản phẩm nào sắp hết hàng</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent transactions */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            🕐 Giao dịch gần đây
                        </h3>
                    </div>
                    <div className="section-content">
                        {recentTransactions.length > 0 ? (
                            <div className="recent-transactions-list">
                                {recentTransactions.map(transaction => (
                                    <div key={transaction.id} className="transaction-item">
                                        <div className="transaction-info">
                                            <div className="transaction-product">{transaction.productName}</div>
                                            <div className="transaction-meta">
                                                {formatDate(transaction.createdAt)} • {transaction.quantity} sản phẩm
                                            </div>
                                        </div>
                                        <span className={`transaction-badge ${transaction.type}`}>
                                            {transaction.type === 'buy' ? 'Nhập' : 'Bán'}
                                        </span>
                                        <span className="transaction-amount">
                                            {formatCurrency(transaction.totalAmount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📝</div>
                                <p className="empty-state-text">Chưa có giao dịch nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
