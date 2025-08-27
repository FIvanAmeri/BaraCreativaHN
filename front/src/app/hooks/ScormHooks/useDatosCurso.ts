'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';
import { Curso } from '@/app/types/curso';

interface UseDatosCursoResult {
  curso: Curso | null;
  usuarioId: number | null;
  loading: boolean;
  error: string;
  crearOrden: () => Promise<string>;
  onApprove: (data: OnApproveData) => Promise<void>;
}

export function useDatosCurso(): UseDatosCursoResult {
  const { id: cursoId } = useParams() as { id: string };
  const router = useRouter();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCurso = async () => {
      try {
        const resCurso = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoId}`, {
          credentials: 'include',
        });
        if (!resCurso.ok) {
          throw new Error('No se pudo cargar el programa.');
        }

        const dataCurso: Curso = await resCurso.json();
        if (!cancelled) {
          setCurso(dataCurso);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error desconocido al cargar los datos del curso.';
          setError(message);
          toast.error('Error al cargar la información del programa.');
        }
      }
    };
    
    const fetchUsuario = async () => {
      try {
        const resUsuario = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/me`, {
          credentials: 'include',
        });
        if (!resUsuario.ok) {
          if (resUsuario.status === 401) {
            if (!cancelled) {
              toast.error('Necesitas iniciar sesión o registrarte para continuar.', { duration: 3000 });
              redirectTimeout.current = setTimeout(() => router.push('/login'), 3000);
            }
          }
          throw new Error('No se pudo obtener el usuario.');
        }

        const usuario = await resUsuario.json();
        if (!cancelled) {
          setUsuarioId(usuario.id);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error desconocido al obtener el usuario.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchCurso();
    fetchUsuario();

    return () => {
      cancelled = true;
      if (redirectTimeout.current) clearTimeout(redirectTimeout.current);
    };
  }, [cursoId, router]);

  const crearOrden = useCallback(async (): Promise<string> => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado para crear la orden.');
      throw new Error('Usuario no autenticado');
    }
    if (!cursoId) {
      toast.error('ID del curso inválido.');
      throw new Error('ID de curso inválido');
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cursoId: Number(cursoId),
          usuarioId,
          currency_code: 'USD',
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error al crear la orden de PayPal:', errorText);
        throw new Error(`Error al crear la orden: ${errorText}`);
      }

      const data = await res.json();
      return data.orderId;
    } catch (error) {
      toast.error('No se pudo iniciar el proceso de pago. Intenta de nuevo.');
      throw error;
    }
  }, [usuarioId, cursoId]);

  const onApprove = useCallback(async (data: OnApproveData) => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado para completar el pago.');
      return;
    }
    if (!data.orderID) {
      toast.error('ID de orden inválido.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('Error al capturar el pago de PayPal:', errData);
        throw new Error(errData.message || 'Error al capturar el pago.');
      }

      toast.success('¡Pago completado con éxito! Aguarda que vas a ser redirigido.');
      router.push(`/cursos/${cursoId}/scorm`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al finalizar el pago.';
      setError(message);
      toast.error('Hubo un problema al procesar tu pago. Por favor, contacta a soporte.');
    }
  }, [usuarioId, router, cursoId]);

  return { curso, usuarioId, loading, error, crearOrden, onApprove };
}
