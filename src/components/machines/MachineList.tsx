import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMachines } from '../../hooks/useMachines';
import type { Machine } from '../../types/index';
import MachineCard from './MachineCard';
import MachineForm from './MachineForm';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

export default function MachineList() {
  const {
    machines,
    activeMachine,
    addMachine,
    updateMachine,
    deleteMachine,
    setActiveMachine,
  } = useMachines();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [deletingMachine, setDeletingMachine] = useState<Machine | null>(null);

  const handleAddMachine = (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => {
    addMachine(machineData);
    setIsAddModalOpen(false);
  };

  const handleEditMachine = (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMachine) {
      updateMachine(editingMachine.id, machineData);
      setEditingMachine(null);
    }
  };

  const handleDeleteMachine = () => {
    if (deletingMachine) {
      deleteMachine(deletingMachine.id);
      setDeletingMachine(null);
    }
  };

  // Empty state
  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <Plus className="text-gray-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Machines Yet
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Add your first skill game machine to start tracking sessions and using Follow Me helper.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Machine
          </button>
        </div>

        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Machine"
        >
          <MachineForm
            onSave={handleAddMachine}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>
      </div>
    );
  }

  // Machine list with cards
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">
          My Machines ({machines.length})
        </h2>
        <p className="text-sm text-gray-400">
          {activeMachine
            ? `Active: ${activeMachine.name}`
            : 'Select a machine to make it active'}
        </p>
      </div>

      {/* Machine Cards */}
      <div className="space-y-3">
        {machines.map((machine) => (
          <div key={machine.id} className="relative">
            <MachineCard
              machine={machine}
              isActive={activeMachine?.id === machine.id}
              onSelect={() => setActiveMachine(machine.id)}
              onEdit={() => setEditingMachine(machine)}
            />

            {/* Delete Button (only show on active/hover) */}
            <button
              onClick={() => setDeletingMachine(machine)}
              className="absolute top-4 right-14 p-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Delete machine"
              title="Delete machine"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Machine Button (Fixed at bottom) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-yellow-400 text-gray-900 rounded-full shadow-lg hover:bg-yellow-500 transition-all flex items-center justify-center hover:scale-110"
        aria-label="Add new machine"
      >
        <Plus size={24} />
      </button>

      {/* Add Machine Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Machine"
      >
        <MachineForm
          onSave={handleAddMachine}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Machine Modal */}
      <Modal
        isOpen={editingMachine !== null}
        onClose={() => setEditingMachine(null)}
        title="Edit Machine"
      >
        {editingMachine && (
          <MachineForm
            machine={editingMachine}
            onSave={handleEditMachine}
            onCancel={() => setEditingMachine(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingMachine !== null}
        onConfirm={handleDeleteMachine}
        onCancel={() => setDeletingMachine(null)}
        title="Delete Machine?"
        message={`Are you sure you want to delete "${deletingMachine?.name}"? This action cannot be undone and will remove all associated session data.`}
      />
    </div>
  );
}
