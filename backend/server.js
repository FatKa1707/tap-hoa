const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL: ' + err.stack);
        return;
    }
    console.log('Đã kết nối MySQL thành công.');
});

// --- API AUTH ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email đã tồn tại' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Đăng ký thành công', id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server khi đăng ký' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

        const user = results[0];
        // So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

        // Loại bỏ mật khẩu trước khi trả về
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    });
});

// --- API PRODUCTS ---
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products ORDER BY updatedAt DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const { name, category, unit, quantity, costPrice, sellingPrice, minStock } = req.body;
    const query = 'INSERT INTO products (name, category, unit, quantity, costPrice, sellingPrice, minStock) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, category, unit, quantity, costPrice, sellingPrice, minStock], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Thêm hàng hoá thành công', id: result.insertId });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const query = 'UPDATE products SET ? WHERE id = ?';
    db.query(query, [updates, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cập nhật thành công' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Xoá thành công' });
    });
});

// --- API TRANSACTIONS ---
app.get('/api/transactions', (req, res) => {
    db.query('SELECT * FROM transactions ORDER BY createdAt DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/transactions', (req, res) => {
    const { productId, productName, type, quantity, unitPrice, totalAmount, notes } = req.body;
    const query = 'INSERT INTO transactions (productId, productName, type, quantity, unitPrice, totalAmount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [productId, productName, type, quantity, unitPrice, totalAmount, notes], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Ghi giao dịch thành công', id: result.insertId });
    });
});

app.delete('/api/transactions/:id', (req, res) => {
    db.query('DELETE FROM transactions WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Xoá giao dịch thành công' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server backend đang chạy tại port ${PORT}`));
