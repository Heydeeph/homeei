import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Thermometer,
  Lock,
  Video,
  Power,
  Fan,
  Speaker,
  Settings,
  Home,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { AddDevice } from './components/AddDevice';

interface Device {
  id: string;
  name: string;
  type: string;
  status: boolean;
  value?: number;
  room?: string;
  color: string;
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room Lights', type: 'light', status: false, room: 'Living Room', color: 'amber' },
    { id: '2', name: 'Smart Thermostat', type: 'thermostat', status: true, value: 72, room: 'Whole House', color: 'emerald' },
    { id: '3', name: 'Front Door Lock', type: 'lock', status: true, room: 'Entrance', color: 'purple' },
    { id: '4', name: 'Security Camera', type: 'camera', status: true, room: 'Entrance', color: 'rose' },
    { id: '5', name: 'Smart TV', type: 'tv', status: false, room: 'Living Room', color: 'cyan' },
    { id: '6', name: 'Ceiling Fan', type: 'fan', status: false, room: 'Bedroom', color: 'indigo' },
    { id: '7', name: 'Smart Speaker', type: 'speaker', status: true, room: 'Living Room', color: 'fuchsia' },
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      // First clear the session state locally
      setSession(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Error during sign out:', error.message);
        // Even if there's an error, we've already cleared the local session
        // so the user will be signed out locally
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error: any) {
      console.warn('Error during sign out:', error.message);
      // The user will still be signed out locally due to setSession(null)
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: !device.status } : device
    ));
  };

  const adjustTemperature = (id: string, increment: boolean) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, value: (device.value || 0) + (increment ? 1 : -1) } : device
    ));
  };

  const handleAddDevice = (newDevice: Device) => {
    setDevices([...devices, newDevice]);
  };

  const getDeviceIcon = (type: string, color: string, active: boolean) => {
    const props = {
      size: 28,
      strokeWidth: 1.5,
      className: `transition-all duration-300 transform ${active ? 'scale-110' : 'scale-100'}`
    };

    switch (type) {
      case 'light': return <Lightbulb {...props} />;
      case 'thermostat': return <Thermometer {...props} />;
      case 'lock': return <Lock {...props} />;
      case 'camera': return <Video {...props} />;
      case 'tv': return <Power {...props} />;
      case 'fan': return <Fan {...props} />;
      case 'speaker': return <Speaker {...props} />;
      default: return <Settings {...props} />;
    }
  };

  const getColorClasses = (color: string, active: boolean) => {
    const colorMap: Record<string, { bg: string, shadow: string, text: string }> = {
      amber: { bg: 'bg-amber-500', shadow: 'shadow-amber-500/50', text: 'text-amber-500' },
      emerald: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', text: 'text-emerald-500' },
      purple: { bg: 'bg-purple-500', shadow: 'shadow-purple-500/50', text: 'text-purple-500' },
      rose: { bg: 'bg-rose-500', shadow: 'shadow-rose-500/50', text: 'text-rose-500' },
      cyan: { bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/50', text: 'text-cyan-500' },
      indigo: { bg: 'bg-indigo-500', shadow: 'shadow-indigo-500/50', text: 'text-indigo-500' },
      fuchsia: { bg: 'bg-fuchsia-500', shadow: 'shadow-fuchsia-500/50', text: 'text-fuchsia-500' },
    };

    return {
      icon: active ? colorMap[color].text : darkMode ? 'text-gray-500' : 'text-gray-400',
      button: active ? colorMap[color].bg : darkMode ? 'bg-gray-600' : 'bg-gray-300',
      shadow: active ? colorMap[color].shadow : ''
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const rooms = Array.from(new Set(devices.map(device => device.room)));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-right" />
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-10 backdrop-blur-md bg-opacity-90 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/50"
              >
                <Home size={28} strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Homey
              </h1>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/50' 
                    : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                }`}
              >
                {darkMode ? <Sun size={28} strokeWidth={1.5} /> : <Moon size={28} strokeWidth={1.5} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="p-3 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/50"
              >
                <LogOut size={28} strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {rooms.map((room, index) => (
            <motion.div
              key={room}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-12"
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {room}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {devices.filter(device => device.room === room).map(device => {
                    const colors = getColorClasses(device.color, device.status);
                    return (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        className={`rounded-2xl p-6 transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-800/50 hover:bg-gray-800' 
                            : 'bg-white hover:bg-gray-50'
                        } backdrop-blur-sm shadow-xl ${device.status ? colors.shadow : ''}`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-3 rounded-2xl ${device.status ? `bg-gradient-to-br from-${device.color}-400 to-${device.color}-600` : darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-all duration-300`}
                            >
                              <span className={colors.icon}>
                                {getDeviceIcon(device.type, device.color, device.status)}
                              </span>
                            </motion.div>
                            <div>
                              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {device.name}
                              </h3>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {device.status ? 'On' : 'Off'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                          {device.type === 'thermostat' && (
                            <div className="flex items-center gap-3 bg-gray-900/10 rounded-xl p-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => adjustTemperature(device.id, false)}
                                className={`p-2 rounded-lg ${
                                  darkMode 
                                    ? 'hover:bg-gray-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                              >
                                -
                              </motion.button>
                              <span className={`min-w-[3ch] text-center font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {device.value}°
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => adjustTemperature(device.id, true)}
                                className={`p-2 rounded-lg ${
                                  darkMode 
                                    ? 'hover:bg-gray-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                              >
                                +
                              </motion.button>
                            </div>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleDevice(device.id)}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${colors.button}`}
                          >
                            <motion.span
                              layout
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                device.status ? 'translate-x-8' : 'translate-x-1'
                              }`}
                            />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <AddDevice onAddDevice={handleAddDevice} />
    </div>
  );
}

export default App;