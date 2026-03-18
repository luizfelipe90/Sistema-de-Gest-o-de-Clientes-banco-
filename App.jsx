import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ nome: '', empresa: '', email: '' });
  const [editandoId, setEditandoId] = useState(null);

  const carregar = async () => {
    const res = await fetch(`http://localhost:3001/clientes?busca=${busca}`);
    setClientes(await res.json());
  };

  useEffect(() => { carregar(); }, [busca]);

  const salvar = async (e) => {
    e.preventDefault();
    const url = editandoId ? `http://localhost:3001/clientes/${editandoId}` : 'http://localhost:3001/clientes';
    await fetch(url, {
      method: editandoId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ nome: '', empresa: '', email: '' });
    setEditandoId(null);
    carregar();
  };

  return (
    <div className="container">
      <h1>Gestão de Clientes</h1>
      
      <input 
        className="search-input"
        placeholder="🔍 Pesquisar no banco de dados..." 
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <form onSubmit={salvar} className="form-card">
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} required />
        <input placeholder="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <button type="submit">{editandoId ? 'Salvar Edição' : 'Cadastrar'}</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Nome</th><th>Empresa</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.empresa}</td>
                <td>
                  <button onClick={() => {setForm(c); setEditandoId(c.id)}}>Editar</button>
                  <button onClick={async () => {await fetch(`http://localhost:3001/clientes/${c.id}`, {method:'DELETE'}); carregar()}}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}