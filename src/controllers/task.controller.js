const db = require('../config/db');

exports.getTasks = (req, res) => {
  const sql = 'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha_limite ASC';
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener tareas' });
    res.json(results);
  });
};

exports.createTask = (req, res) => {
  const { titulo, descripcion, prioridad, fecha_limite } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  const sql = 'INSERT INTO tareas (usuario_id, titulo, descripcion, prioridad, fecha_limite) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [req.userId, titulo, descripcion, prioridad || 'media', fecha_limite], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al crear tarea' });
    res.status(201).json({ message: 'Tarea creada exitosamente', id: result.insertId });
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  console.log('=== INICIANDO UPDATE ===');
  console.log('Tarea ID:', id);
  console.log('Usuario ID:', req.userId);
  console.log('Body:', req.body);

  const sqlGet = 'SELECT * FROM tareas WHERE id = ? AND usuario_id = ?';
  db.query(sqlGet, [id, req.userId], (err, results) => {
    console.log('Query SELECT ejecutado');
    if (err) {
      console.error('❌ Error SQL en SELECT:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    
    console.log('Resultados encontrados:', results.length);
    if (results.length === 0) {
      console.log('❌ Tarea no encontrada');
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const tarea = results[0];
    const { titulo, descripcion, prioridad, fecha_limite, completada } = req.body;

    const nuevoTitulo = titulo ?? tarea.titulo;
    const nuevaDesc = descripcion ?? tarea.descripcion;
    const nuevaPrioridad = prioridad ?? tarea.prioridad;
    
    // Convertir fecha ISO a formato MySQL (YYYY-MM-DD)
    let nuevaFecha = tarea.fecha_limite;
    if (fecha_limite) {
      nuevaFecha = new Date(fecha_limite).toISOString().split('T')[0];
    }
    
    const nuevoCompletada = completada ?? tarea.completada;
    const nuevaFechaCompletado = nuevoCompletada == 1 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

    console.log('Nuevos valores:', { nuevoTitulo, nuevoCompletada, nuevaFecha });

    const sqlUpdate = `UPDATE tareas SET titulo = ?, descripcion = ?, prioridad = ?, 
                       fecha_limite = ?, completada = ?, fecha_completado = ?
                       WHERE id = ? AND usuario_id = ?`;

    db.query(sqlUpdate, [nuevoTitulo, nuevaDesc, nuevaPrioridad, nuevaFecha, nuevoCompletada, nuevaFechaCompletado, id, req.userId], (err2) => {
      if (err2) {
        console.error('❌ Error SQL en UPDATE:', err2);
        return res.status(500).json({ message: 'Error al actualizar tarea' });
      }
      console.log('✅ Tarea actualizada exitosamente');
      res.json({ message: 'Tarea actualizada exitosamente' });
    });
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tareas WHERE id = ? AND usuario_id = ?';
  db.query(sql, [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar tarea' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada exitosamente' });
  });
};