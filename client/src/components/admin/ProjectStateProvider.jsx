'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createProject, deleteProject as deleteProjectDocument, replaceProjectImages, subscribeToProjects, updateProject as updateProjectDocument, updateProjectOrder as updateProjectOrderDocuments } from '@/lib/projects';

const ProjectStateContext = createContext(null);

export function ProjectStateProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return subscribeToProjects({}, (items) => {
      setProjects(items);
      setLoading(false);
      setError(null);
    }, (err) => {
      setError(err);
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({
    projects,
    loading,
    error,
    async addProject(project) {
      const projectToCreate = { status: 'Draft', images: [], order: projects.length, ...project };
      const projectId = await createProject(projectToCreate);
      await updateProjectOrderDocuments([...projects.map((item) => item.id), projectId]);
      return projectId;
    },
    updateProject(projectId, updates) {
      return updateProjectDocument(projectId, updates);
    },
    updateProjectOrder(projectIds) {
      return updateProjectOrderDocuments(projectIds);
    },
    addProjectImages(projectId, images) {
      const project = projects.find((item) => item.id === projectId);
      if (!project || !images.length) return Promise.resolve();
      return replaceProjectImages(projectId, [...project.images, ...images]);
    },
    removeProjectImage(projectId, imageIndex) {
      const project = projects.find((item) => item.id === projectId);
      if (!project) return Promise.resolve();
      return replaceProjectImages(projectId, project.images.filter((_, index) => index !== imageIndex));
    },
    deleteProject(projectId) {
      return deleteProjectDocument(projectId);
    },
  }), [error, loading, projects]);

  return (
    <ProjectStateContext.Provider value={value}>
      {children}
    </ProjectStateContext.Provider>
  );
}

export function useProjectState() {
  const context = useContext(ProjectStateContext);
  if (!context) throw new Error('useProjectState must be used inside ProjectStateProvider');
  return context;
}
