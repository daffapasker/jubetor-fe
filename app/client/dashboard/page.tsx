// app/dashboard/page.tsx (Server Component)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/views/DashboardClient';

async function getProjects(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/my-projects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/login');
      }
      throw new Error('Failed to fetch projects');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { data: [] };
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  
  // Coba beberapa kemungkinan nama cookie
  let token = cookieStore.get('token')?.value;
  if (!token) token = cookieStore.get('accessToken')?.value;
  if (!token) token = cookieStore.get('access_token')?.value;
  
  console.log('Token found:', !!token); // Debug: cek apakah token ada
  
  if (!token) {
    redirect('/login');
  }

  const result = await getProjects(token);
  
  // Pastikan mengirim data yang benar ke client
  const projects = result.data || [];
  
  return <DashboardClient initialProjects={projects} />;
}