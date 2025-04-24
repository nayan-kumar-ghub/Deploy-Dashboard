// A React-based website showing deployment environment and server stats
'this should be hosted on a backend that exposes these stats via an API endpoint'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [envMessage, setEnvMessage] = useState("Detecting deployment environment...");
  const [stats, setStats] = useState({ cpu: 0, memory: 0, disk: 0, uptime: "" });

  useEffect(() => {
    const detectEnvironment = async () => {
      try {
        const res = await axios.get('/api/environment');
        setEnvMessage(`Your website is successfully deployed in ${res.data.environment}`);
      } catch (error) {
        setEnvMessage("Could not detect deployment environment.");
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    detectEnvironment();
    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">{envMessage}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-800">
          <CardContent>
            <h2 className="text-xl">CPU Usage</h2>
            <p>{stats.cpu}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardContent>
            <h2 className="text-xl">Memory Usage</h2>
            <p>{stats.memory}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardContent>
            <h2 className="text-xl">Disk Usage</h2>
            <p>{stats.disk}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 col-span-1 sm:col-span-3">
          <CardContent>
            <h2 className="text-xl">Uptime</h2>
            <p>{stats.uptime}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
