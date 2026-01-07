import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");

    async function load() {
    try {
        setLoading(true);
        setErr("");
        const res = await api.get("/api/products");
        setProducts(res.data ?? res);
    } catch (e) {
         setErr(e.message);
    } finally {
        setLoading(false);
 }
}

useEffect(() => { load(); }, []);
async function createProduct(e) {
    e.preventDefault();
    try {
        const created = await api.post("/api/products", { name, price: Number(price) });
        setProducts((p) => [ ...(Array.isArray(p) ? p : p.data), created ]);
        setName(""); setPrice("");
    } catch (e) {
        alert(e.message);
    }
 }

async function deleteProduct(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    const prev = products;
    setProducts(products.filter((p) => p.id !== id));
    try {
        await api.del(`/api/products/${id}`);
    } catch (e) {
        console.error(e);
        alert("Suppression échouée, retour état précédent");
        setProducts(prev);
    }
 }

function startEdit(p) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price ?? ""));
}

function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
}

async function saveEdit() {
    try {
        const updated = await api.put(`/api/products/${editingId}`, { name: editName, price: Number(editPrice) });
        setProducts((p) => {
            const arr = Array.isArray(p) ? p : p.data;
            const next = arr.map((it) => (it.id === editingId ? updated : it));
            return Array.isArray(p) ? next : { ...p, data: next };
        });
        cancelEdit();
    } catch (e) {
        alert(e.message);
    }
}

if (loading) return <p>Chargement…</p>;
if (err) return <p style={{ color: "crimson" }}>Erreur: {err}</p>;

const list = Array.isArray(products) ? products : products.data;

return (

<div>
    <h2>Products</h2>
    <form onSubmit={createProduct} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)}
        required />
        <input placeholder="price" type="number" step="0.01" value={price} onChange={(e) =>
        setPrice(e.target.value)} required />
        <button>Ajouter</button>
    </form>
    <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
            <tr>
            <th align="left">ID</th>
            <th align="left">Name</th>
            <th align="left">Price</th>
            <th align="left">Actions</th>
        </tr>
        </thead>
        <tbody>
            {list.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #ddd" }}>
                <td>{p.id}</td>
                <td>
                    {editingId === p.id ? (
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    ) : (
                        p.name
                    )}
                </td>
                <td>
                    {editingId === p.id ? (
                        <input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                    ) : (
                        p.price
                    )}
                </td>
                <td>
                    {editingId === p.id ? (
                        <>
                            <button onClick={saveEdit}>Enregistrer</button>
                            <button onClick={cancelEdit}>Annuler</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => startEdit(p)}>Éditer</button>
                            <button onClick={() => deleteProduct(p.id)}>Supprimer</button>
                        </>
                    )}
                </td>
            </tr>
            ))}

            {list.length === 0 && (
                <tr><td colSpan="4">Aucun produit pour le moment.</td></tr>
            )}
        </tbody>
    </table>
</div>
 );
}


