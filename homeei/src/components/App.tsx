import React, { useState } from 'react';
import { Frame, Page, ScrollView, StackLayout, FlexboxLayout, Label, Switch } from '@nativescript/core/ui';
import {
  Lightbulb,
  Thermometer,
  Lock,
  Video,
  Power,
  Fan,
  Speaker,
  Settings,
  Home
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: boolean;
  value?: number;
}

export function App() {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room Lights', type: 'light', status: false },
    { id: '2', name: 'Thermostat', type: 'thermostat', status: true, value: 72 },
    { id: '3', name: 'Front Door Lock', type: 'lock', status: true },
    { id: '4', name: 'Security Camera', type: 'camera', status: true },
    { id: '5', name: 'TV', type: 'tv', status: false },
    { id: '6', name: 'Ceiling Fan', type: 'fan', status: false },
    { id: '7', name: 'Smart Speaker', type: 'speaker', status: true },
  ]);

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

  const getDeviceIcon = (type: string, active: boolean) => {
    const props = {
      size: 24,
      className: active ? 'icon-active' : 'icon-inactive'
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

  return (
    <Frame>
      <Page className="page">
        <StackLayout>
          <FlexboxLayout className="header" justifyContent="flex-start" alignItems="center">
            <Home size={32} className="icon-active" />
            <Label text="Smart Home Control Center" className="header-title" marginLeft={8} />
          </FlexboxLayout>

          <ScrollView>
            <StackLayout>
              {devices.map(device => (
                <FlexboxLayout key={device.id} className="card">
                  <FlexboxLayout flexDirection="row" justifyContent="space-between" alignItems="center">
                    <FlexboxLayout alignItems="center">
                      {getDeviceIcon(device.type, device.status)}
                      <Label text={device.name} className="device-name" marginLeft={8} />
                    </FlexboxLayout>

                    <FlexboxLayout alignItems="center">
                      {device.type === 'thermostat' && (
                        <FlexboxLayout alignItems="center" marginRight={8}>
                          <Label
                            text="-"
                            className="device-name"
                            padding={8}
                            onTap={() => adjustTemperature(device.id, false)}
                          />
                          <Label text={`${device.value}°`} className="device-name" marginHorizontal={8} />
                          <Label
                            text="+"
                            className="device-name"
                            padding={8}
                            onTap={() => adjustTemperature(device.id, true)}
                          />
                        </FlexboxLayout>
                      )}
                      <Switch
                        checked={device.status}
                        className="switch"
                        onCheckedChange={() => toggleDevice(device.id)}
                      />
                    </FlexboxLayout>
                  </FlexboxLayout>

                  <Label
                    text={`Status: ${device.status ? 'On' : 'Off'}`}
                    className="device-status"
                    marginTop={8}
                  />
                </FlexboxLayout>
              ))}
            </StackLayout>
          </ScrollView>
        </StackLayout>
      </Page>
    </Frame>
  );
}