"use client";

import React, { useEffect, useState } from "react";
import { Users, Shield, ShieldCheck, UserCheck, Search, RefreshCw } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert("Error al cambiar rol");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios & Roles</h1>
        <p className="text-slate-400 text-sm mt-1">
          Otorga roles de Moderador o Administrador a los usuarios registrados
        </p>
      </div>

      {/* Bar for Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar usuario por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
          title="Refrescar usuarios"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Users List Table */}
      {loading ? (
        <div className="text-slate-400 text-sm">Cargando usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No se encontraron usuarios coincidentes.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Rol Actual</th>
                <th className="py-3.5 px-4">Fecha Registro</th>
                <th className="py-3.5 px-4 text-right">Asignar Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Administrador
                      </span>
                    ) : user.role === "moderator" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full font-semibold">
                        <Shield className="w-3.5 h-3.5" /> Moderador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
                        <UserCheck className="w-3.5 h-3.5" /> Cliente / Usuario
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={user.role}
                      disabled={updatingId === user._id}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="user">Usuario normal</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
