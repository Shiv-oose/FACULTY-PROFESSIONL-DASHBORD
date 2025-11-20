import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Database, Check, X } from 'lucide-react';
import { apiClient } from '../utils/api';

interface DemoDataInitializerProps {
  onClose: () => void;
}

export default function DemoDataInitializer({ onClose }: DemoDataInitializerProps) {

}