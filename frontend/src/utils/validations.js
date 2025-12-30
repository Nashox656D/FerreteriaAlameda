// Utilidades de validación para formularios

/**
 * Valida que un nombre no contenga números
 * @param {string} nombre - El nombre a validar
 * @returns {object} - { valid: boolean, error: string }
 */
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return { valid: false, error: 'El nombre es requerido' };
  }
  
  // Verificar que no contenga números
  const tieneNumeros = /\d/.test(nombre);
  if (tieneNumeros) {
    return { valid: false, error: 'El nombre no puede contener números' };
  }
  
  return { valid: true, error: '' };
};

/**
 * Valida formato de RUT chileno (7-9 dígitos + guión + dígito verificador)
 * Formatos aceptados: 1234567-8, 12345678-9 o 12.345.678-9
 * @param {string} rut - El RUT a validar
 * @returns {object} - { valid: boolean, error: string }
 */
export const validarRUT = (rut) => {
  if (!rut || rut.trim() === '') {
    return { valid: false, error: 'El RUT es requerido' };
  }
  
  // Limpiar RUT de manera agresiva: eliminar puntos, espacios, y normalizar
  const rutLimpio = rut
    .trim()
    .replace(/\./g, '')
    .replace(/\s/g, '')
    .toUpperCase();
  
  // Verificar formato: 7-9 dígitos, guión, dígito verificador (0-9 o K)
  const formatoRUT = /^\d{7,9}-[\dK]$/;
  
  if (!formatoRUT.test(rutLimpio)) {
    return { 
      valid: false, 
      error: 'Formato de RUT inválido. Debe ser: 12345678-9 (7 a 9 dígitos + guión + verificador)' 
    };
  }
  
  // Validar dígito verificador
  const [cuerpo, dv] = rutLimpio.split('-');
  const dvCalculado = calcularDV(cuerpo);
  
  if (dv !== dvCalculado) {
    return { 
      valid: false, 
      error: `El dígito verificador no es válido. Debería ser: ${cuerpo}-${dvCalculado}` 
    };
  }
  
  return { valid: true, error: '' };
};

/**
 * Calcula el dígito verificador de un RUT
 * @param {string} rut - El cuerpo del RUT (sin DV)
 * @returns {string} - El dígito verificador
 */
const calcularDV = (rut) => {
  let suma = 0;
  let multiplicador = 2;
  
  // Recorrer de derecha a izquierda
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dv = 11 - resto;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
};

/**
 * Formatea un RUT agregando puntos y guión
 * @param {string} rut - El RUT a formatear
 * @returns {string} - El RUT formateado
 */
export const formatearRUT = (rut) => {
  // Eliminar todo excepto números y K
  let valor = rut.replace(/[^\dkK]/g, '').toUpperCase();
  
  // Si está vacío o tiene solo 1 carácter, retornar sin formato
  if (valor.length <= 1) return valor;
  
  // Separar cuerpo y DV (último carácter)
  let cuerpo = valor.slice(0, -1);
  let dv = valor.slice(-1);
  
  // Agregar puntos al cuerpo (cada 3 dígitos de derecha a izquierda)
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Retornar con formato: cuerpo-dv
  return `${cuerpo}-${dv}`;
};

/**
 * Valida que un email sea válido
 * @param {string} email - El email a validar
 * @returns {object} - { valid: boolean, error: string }
 */
export const validarEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'El email es requerido' };
  }
  
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!formatoEmail.test(email)) {
    return { valid: false, error: 'Formato de email inválido' };
  }
  
  return { valid: true, error: '' };
};

/**
 * Valida que el username tenga formato de correo (contenga @ y sea un email válido)
 * Esto fuerza que el usuario utilice su correo como username.
 */
export const validarUsername = (username) => {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'El nombre de usuario es requerido' };
  }

  // Reusar misma validación básica de email
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoEmail.test(username)) {
    return { valid: false, error: 'El usuario debe tener formato de correo (incluir @)' };
  }

  return { valid: true, error: '' };
};

/**
 * Validación genérica de contraseñas para mayor seguridad:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un caracter especial
 */
export const validarPassword = (password) => {
  if (!password || password.trim() === '') {
    return { valid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
    const hasSpecial = new RegExp("[!@#$%^&*(),.?\"':{}|<>/~`_+\\-=]").test(password);

  if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
    return { valid: false, error: 'La contraseña debe incluir mayúscula, minúscula, número y caracter especial' };
  }

  return { valid: true, error: '' };
};

/**
 * Valida que un número sea positivo
 * @param {string|number} numero - El número a validar
 * @param {string} campo - Nombre del campo para el mensaje de error
 * @returns {object} - { valid: boolean, error: string }
 */
export const validarNumeroPositivo = (numero, campo = 'Este campo') => {
  const num = parseFloat(numero);
  
  if (isNaN(num)) {
    return { valid: false, error: `${campo} debe ser un número válido` };
  }
  
  if (num < 0) {
    return { valid: false, error: `${campo} debe ser un número positivo` };
  }
  
  return { valid: true, error: '' };
};
