"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VacantPositionsTable from "@/components/vacant-positions/VacantPositionsTable";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getVacantPositions, getRecruiters } from "@/app/actions/vacant-positions";

export default function VacantPositionsPage() {
    const [vacantPositions, setVacantPositions] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [positionsResult, recruitersResult] = await Promise.all([
                getVacantPositions(),
                getRecruiters()
            ]);
            setVacantPositions(positionsResult.data || []);
            setRecruiters(recruitersResult.data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Vacant Positions" />
            <motion.div
                className="flex flex-col gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <VacantPositionsTable
                    initialData={vacantPositions}
                    recruiters={recruiters}
                />
            </motion.div>
        </motion.div>
    );
}
