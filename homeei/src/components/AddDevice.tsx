import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lightbulb, Thermometer, Lock, Video, Power, Fan, Speaker } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddDeviceProps {
  onAddDevice: (device: any) => void;
}

const deviceTypes = [
  { id: 'light', name: 'Light', icon: Lightbulb, color: 'amber' },
  { id: 'thermostat', name: 'Thermostat', icon: Thermometer, color: 'emerald' },
  { id: 'lock', name: 'Lock', icon: Lock, color: 'purple' },
  { id: 'camera', name: 'Camera', icon: Video, color: 'rose' },
  { id: 'tv', name: 'TV', icon: Power, color: 'cyan' },
  { id: 'fan', name: 'Fan', icon: Fan, color: 'indigo' },
  { id: 'speaker', name: 'Speaker', icon: Speaker, color: 'fuchsia' },
];

export function AddDevice({ onAddDevice }: AddDeviceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !room) {
      toast.error('Please fill in all fields');
      return;
    }

    const deviceType = deviceTypes.find(d => d.id === type);
    const newDevice = {
      id: crypto.randomUUID(),
      name,
      type,
      room,
      status: false,
      color: deviceType?.color || 'gray'
    };

    onAddDevice(newDevice);
    toast.success('Device added successfully!');
    setIsOpen(false);
    setName('');
    setType('');
    setRoom('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 z-50"
      >
        <Plus size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Add New Device</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Living Room Light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {deviceTypes.map((deviceType) => (
                      <button
                        key={deviceType.id}
                        type="button"
                        onClick={() => setType(deviceType.id)}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          type === deviceType.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <deviceType.icon size={20} />
                        <span className="text-xs">{deviceType.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a room</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Office">Office</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Device
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}