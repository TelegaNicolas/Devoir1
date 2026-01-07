import { useEffect, useState } from "react";
import { api } from "../api/client";
export default function UsersPage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");

    async function load() {
    try {
        setLoading(true);
        setErr("");
        const res = await api.get("/api/users");
        setUsers(res.data ?? res); // selon ton contrôleur (liste ou {total,data})
    } catch (e) {
         setErr(e.message);
    } finally {
        setLoading(false);
 }
}

useEffect(() => { load(); }, []);

async function createUser(e) {
    e.preventDefault();
    try {
        const created = await api.post("/api/users", { name, age: Number(age) });
        setUsers((u) => [ ...(Array.isArray(u) ? u : u.data), created ]);
        setName(""); setAge("");
    } catch (e) {
        alert(e.message);
    }
 }

async function deleteUser(id) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const prev = users;
    setUsers(users.filter((u) => u.id !== id));
    try {
        await api.del(`/api/users/${id}`);
    } catch (e) {
        console.error(e);
        alert("Suppression échouée, retour état précédent");
        setUsers(prev);
    }
 }

function startEdit(u) {
    setEditingId(u.id);
    setEditName(u.name);
    setEditAge(String(u.age ?? ""));
}

function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditAge("");
}

async function saveEdit() {
    try {
        const updated = await api.put(`/api/users/${editingId}`, { name: editName, age: Number(editAge) });
        setUsers((u) => {
            const arr = Array.isArray(u) ? u : u.data;
            const next = arr.map((it) => (it.id === editingId ? updated : it));
            return Array.isArray(u) ? next : { ...u, data: next };
        });
        cancelEdit();
    } catch (e) {
        alert(e.message);
    }
}



if (loading) return <p>Chargement…</p>;
if (err) return <p style={{ color: "crimson" }}>Erreur: {err}</p>;

const list = Array.isArray(users) ? users : users.data;

return (

<div>
    <h2>Users</h2>
    <form onSubmit={createUser} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)}
        required />
        <input placeholder="age" type="number" value={age} onChange={(e) =>
        setAge(e.target.value)} required />
        <button>Ajouter</button>
    </form>
    <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
            <tr>
            <th align="left">ID</th>
            <th align="left">Name</th>
            <th align="left">Age</th>
            <th align="left">Actions</th>
        </tr>
        </thead>
        <tbody>
            {list.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid #ddd" }}>
                <td>{u.id}</td>
                <td>
                    {editingId === u.id ? (
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    ) : (
                        u.name
                    )}
                </td>
                <td>
                    {editingId === u.id ? (
                        <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                    ) : (
                        u.age
                    )}
                </td>
                <td>
                    {editingId === u.id ? (
                        <>
                            <button onClick={saveEdit}>Enregistrer</button>
                            <button onClick={cancelEdit}>Annuler</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => startEdit(u)}>Éditer</button>
                            <button onClick={() => deleteUser(u.id)}>Supprimer</button>
                        </>
                    )}
                </td>
            </tr>
            ))}

            {list.length === 0 && (
                <tr><td colSpan="4">Aucun utilisateur pour le moment.</td></tr>
            )}
        </tbody>
    </table>
</div>
 );
}
