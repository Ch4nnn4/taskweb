const db = require('../config/db');

const getAllTasks = (req, res) => {
  const sql = `
    SELECT tareas.*, usuarios.nombre as nombre_usuario, usuarios.correo
    FROM tareas
    JOIN usuarios ON tareas.usuario_id = usuarios.id
    ORDER BY tareas.fecha_creacion DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener tareas' });
    res.json(results);
  });
};

const approveTask = (req, res) => {
  const { id } = req.params;
  const { aprobada } = req.body;

  const sql = 'UPDATE tareas SET aprobada = ? WHERE id = ?';
  db.query(sql, [aprobada, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar tarea' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: aprobada ? 'Tarea aprobada' : 'Tarea desaprobada' });
  });
};

module.exports = { getAllTasks, approveTask };