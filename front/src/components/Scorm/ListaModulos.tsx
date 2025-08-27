import { EstadoModuloUsuario } from '@/app/types/scorm-types';

interface ListaModulosProps {
    modulos: EstadoModuloUsuario[]; 
    currentModuleIndex: number; 
    onModuleClick: (index: number) => void;
}

export default function ListaModulos({ modulos, currentModuleIndex, onModuleClick }: ListaModulosProps) {
    return (
        <div className="space-y-2 flex-grow overflow-y-auto pr-2">
            {modulos.map((modulo, index) => (
                <button
                    key={modulo.id}
                    onClick={() => onModuleClick(index)}
                    className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${ 
                        index === currentModuleIndex
                            ? 'bg-blue-600 text-white shadow-md'
                            : modulo.completado
                            ? 'bg-green-100 border border-green-400 text-green-800 line-through opacity-80' 
                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                    disabled={modulo.completado && index !== currentModuleIndex}
                >
                    <span className="font-semibold">{index + 1}. {modulo.titulo}</span>
                    {modulo.completado && <span className="ml-2 text-xs font-normal text-green-600">(Completado)</span>}
                </button>
            ))}
        </div>
    );
}
