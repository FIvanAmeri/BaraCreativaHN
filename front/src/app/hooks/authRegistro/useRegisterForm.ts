import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';


const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password: string): boolean => {
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
  return re.test(password);
};


interface RegisterData {
  nombreCompleto: string;
  correoElectronico: string;
  password: string;
  telefono?: string;
  tipoUsuario: string;
  nombreEmpresa?: string;
  fotoPerfil?: string;
}


const registerUser = async (data: RegisterData): Promise<void> => {
  // Simulate an error for a specific email
  if (data.correoElectronico === 'test@error.com') {
    throw new Error('El correo electrónico ya está en uso.');
  }

  return new Promise((resolve) => setTimeout(resolve, 1000));
};


const TipoUsuario = {
  Alumno: "Alumno",
  Empresa: "Empresa",
};


interface FormData {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  confirmContrasena: string;
  numeroTelefono: string;
  tipoUsuario: string;
  nombreEmpresa: string;
  fotoPerfil: string;
}

export const useRegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "",
    correoElectronico: "",
    contrasena: "",
    confirmContrasena: "",
    numeroTelefono: "",
    tipoUsuario: TipoUsuario.Alumno,
    nombreEmpresa: "",
    fotoPerfil: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const {
      nombreCompleto,
      correoElectronico,
      contrasena,
      confirmContrasena,
      numeroTelefono,
      tipoUsuario,
      nombreEmpresa,
      fotoPerfil,
    } = formData;


    if (nombreCompleto.length < 4) {
      Swal.fire(
        "Error",
        "El nombre completo debe tener al menos 4 caracteres.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(correoElectronico)) {
      Swal.fire(
        "Error",
        "Por favor, introduce un correo electrónico válido.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(contrasena)) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, un carácter especial y un número.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (contrasena !== confirmContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      setIsSubmitting(false);
      return;
    }


    const dataToSend: RegisterData = {
      nombreCompleto,
      correoElectronico,
      password: contrasena,
      telefono: numeroTelefono || undefined,
      tipoUsuario,
      nombreEmpresa: tipoUsuario === TipoUsuario.Empresa ? nombreEmpresa : undefined,
      fotoPerfil: fotoPerfil || undefined,
    };

    try {
      await registerUser(dataToSend);
      await Swal.fire({
        title: "Registro exitoso",
        text: "¡Tu cuenta ha sido creada! Por favor, revisa tu correo electrónico para verificarla.",
        icon: "success",
        confirmButtonText: "Entendido",
      });
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire(
          "Error",
          error.message || "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return {
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
  };
};
