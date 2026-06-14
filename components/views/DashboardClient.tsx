// app/dashboard/DashboardClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Log {
    id: string;
    projectId: string;
    statusName: string;
    startedAt: string;
    completedAt: string | null;
    notes: string;
    image: string;
    createdAt: string;
}

interface Project {
    id: string;
    userId: string;
    motorModel: string;
    licensePlate: string;
    engineNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    logs: Log[];
}

interface DashboardClientProps {
    initialProjects: Project[];
}

export default function DashboardClient({ initialProjects }: DashboardClientProps) {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'STRIPPING': 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
            'ENGINE': 'bg-blue-900/50 text-blue-400 border-blue-700',
            'PAINTING': 'bg-purple-900/50 text-purple-400 border-purple-700',
            'ASSEMBLY': 'bg-indigo-900/50 text-indigo-400 border-indigo-700',
            'DONE': 'bg-green-900/50 text-green-400 border-green-700'
        };
        return colors[status] || 'bg-gray-800 text-gray-400 border-gray-700';
    };

    const getLatestLog = (logs: Log[]) => {
        if (!logs || logs.length === 0) return null;
        return logs.reduce((latest, current) =>
            new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        );
    };

    const getTokenFromCookie = () => {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token' || name === 'accessToken' || name === 'access_token') {
                return value;
            }
        }
        return null;
    };

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = getTokenFromCookie();

            if (!token) {
                console.error('No token found');
                router.push('/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/my-projects`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const result = await response.json();
            setProjects(result.data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProjects();
        const interval = setInterval(fetchProjects, 30000);
        return () => clearInterval(interval);
    }, []);

    const openDetailDialog = (project: Project) => {
        setSelectedProject(project);
        setShowDialog(true);

        // document.body.style.overflow = 'hidden';
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900  p-6">
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                    <p>{error}</p>
                    <button
                        onClick={fetchProjects}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="">
                {/* Header */}
                {/* <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Project Monitoring Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Real-time monitoring of your motorcycle customization projects</p>
          </div>
        </div> */}

                <div className=" max-w-7xl justify-start">
                    {loading && projects.length === 0 ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => {
                                const latestLog = getLatestLog(project.logs);
                                return (
                                    <div
                                        key={project.id}
                                        className="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 overflow-hidden flex flex-col h-full"
                                    >
                                        {/* Project Header */}
                                        <div className="bg-black px-6 py-4 border-b border-gray-800">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors">
                                                        {project.motorModel}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                                        <span className="text-gray-400">Plate: <span className="text-gray-300">{project.licensePlate}</span></span>
                                                        <span className="text-gray-400">Engine: <span className="text-gray-300">{project.engineNumber.substring(0, 8)}...</span></span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 ml-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusColor(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {new Date(project.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Timeline */}
                                        <div className="px-6 pt-6">
                                            <h4 className="font-semibold text-gray-300 mb-4 text-sm">Progress Timeline</h4>
                                            <div className="relative">
                                                <div className="flex justify-between mb-2">
                                                    {['STRIPPING', 'ENGINE', 'PAINTING', 'ASSEMBLY', 'DONE'].map((step, idx) => {
                                                        const isCompleted = project.logs.some(log => log.statusName === step);
                                                        const isCurrent = project.status === step;
                                                        return (
                                                            <div key={step} className="flex flex-col items-center flex-1">
                                                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                                  ${isCompleted ? 'bg-red-600 text-white ring-2 ring-red-500/50' :
                                                                        isCurrent ? 'bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse' :
                                                                            'bg-gray-800 text-gray-500 border border-gray-700'}
                                `}>
                                                                    {idx + 1}
                                                                </div>
                                                                <span className={`text-xs mt-2 text-center hidden md:block truncate max-w-[60px] ${isCurrent ? 'font-semibold text-red-500' : 'text-gray-500'}`}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Current Status */}
                                        {latestLog && (
                                            <div className="mx-6 mt-4 mb-4 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Current Activity</span>
                                                        <p className="text-sm text-gray-300 mt-1 truncate">{latestLog.notes}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                        {new Date(latestLog.startedAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* View Details Button */}
                                        <div className="px-6 py-4 border-t border-gray-800 mt-auto">
                                            <button
                                                onClick={() => openDetailDialog(project)}
                                                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg shadow-red-500/20"
                                            >
                                                View Full Details
                                            </button>
                                        </div>
                                    </div>

                                );
                            })}

                            {!loading && projects.length === 0 && (
                                <div className="col-span-full text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-lg">No projects found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Dialog */}
            {showDialog && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={closeDialog}
                    />

                    {/* Dialog */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative  bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-black z-10 px-6 py-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedProject.motorModel}</h2>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                            <span className="text-gray-400">License Plate: <span className="text-gray-300">{selectedProject.licensePlate}</span></span>
                                            <span className="text-gray-400">Engine Number: <span className="text-gray-300">{selectedProject.engineNumber}</span></span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeDialog}
                                        className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6">
                                {/* Status Overview */}
                                <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm text-gray-400">Current Status</span>
                                            <div className="mt-1">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedProject.status)}`}>
                                                    {selectedProject.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-400">Project Started</span>
                                            <p className="text-white mt-1">{new Date(selectedProject.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Complete Timeline */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                                        Complete History
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedProject.logs
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .map((log, index) => (
                                                <div key={log.id} className="relative pl-6 pb-4">
                                                    {index !== selectedProject.logs.length - 1 && (
                                                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-700"></div>
                                                    )}
                                                    <div className="relative">
                                                        <div className="absolute -left-[21px] top-1">
                                                            <div className="w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-600/20"></div>
                                                        </div>
                                                        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800 hover:border-red-800/50 transition-all">
                                                            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(log.statusName)}`}>
                                                                    {log.statusName}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(log.createdAt).toLocaleString('id-ID', {
                                                                        dateStyle: 'medium',
                                                                        timeStyle: 'short'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-300 mt-2">{log.notes}</p>
                                                            {log.image && (
                                                                <div className="mt-3 flex justify-center">
                                                                    <img
                                                                        src={log.image}
                                                                        alt={`${log.statusName} progress`}
                                                                        className="h-96 w-96 object-cover rounded-lg border border-gray-700 hover:scale-105 transition-transform cursor-pointer"
                                                                        onClick={() => window.open(log.image, '_blank')}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={closeDialog}
                                        className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                    {/* <button
                    onClick={() => {
                      closeDialog();
                      // Optional: refresh data
                      fetchProjects();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Refresh Data
                  </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}