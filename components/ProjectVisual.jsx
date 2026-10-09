'use client';

import CoachLink from './visuals/CoachLink';
import EncodeFlow from './visuals/EncodeFlow';
import FaceMesh from './visuals/FaceMesh';
import LiveMonitor from './visuals/LiveMonitor';
import Screenshot from './visuals/Screenshot';
import TrussLive from './visuals/TrussLive';
import './visuals/visuals.css';

export default function ProjectVisual({ project }) {
  switch (project.visual) {
    case 'shot':
      return <Screenshot shot={project.screens[0]} url={project.site?.label} />;
    case 'truss':
      return <TrussLive />;
    case 'face':
      return <FaceMesh />;
    case 'encode':
      return <EncodeFlow />;
    case 'coach':
      return <CoachLink />;
    case 'monitor':
      return <LiveMonitor />;
    default:
      return null;
  }
}
