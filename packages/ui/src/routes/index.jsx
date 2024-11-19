import { useRoutes } from 'react-router-dom'

// routes
import CanvasRoutes from './CanvasRoutes'
import config from '@/config'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([CanvasRoutes], config.basename)
}
