"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VacantPositionForm from "@/components/vacant-positions/VacantPositionForm";
import { getRecruiters } from "@/app/actions/vacant-positions";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CreateVacantPositionPage() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const { data } = await getRecruiters();
            setRecruiters(data || []);
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Create Vacant Position" />
            <motion.div
                className="flex flex-col gap-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <VacantPositionForm recruiters={recruiters} />
            </motion.div>
        </motion.div>
    );
}
