/*
  CONFIGURACIÓN OPCIONAL DE SUPABASE
  -----------------------------------
  Esta versión funciona en modo local sin configuración adicional.
  Para centralizar los datos entre computadores, crea un proyecto Supabase
  y coloca aquí la URL y la anon key.

  Ejemplo:
  window.AULA_CONFIG = {
    SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
    SUPABASE_ANON_KEY: "TU-ANON-KEY"
  };

  La interfaz incluye el flujo y el almacenamiento local. Para producción
  con datos centralizados se recomienda reemplazar syncStudent() y
  getRecords() en script.js por consultas a las tablas indicadas en README.md.
*/
window.AULA_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: ""
};
