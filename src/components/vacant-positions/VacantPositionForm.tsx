"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVacantPosition, updateVacantPosition } from "@/app/actions/vacant-positions";
import { motion } from "framer-motion";

interface VacantPositionFormProps {
    initialData?: any;
    recruiters: any[];
    isEdit?: boolean;
}

const inputVariants = {
    focus: { scale: 1.02, borderColor: "#5750F1" },
    blur: { scale: 1 }
};

export default function VacantPositionForm({ initialData, recruiters, isEdit }: VacantPositionFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData || {
        jobTitle: "",
        service: "",
        personnelType: "OUVRIER",
        workLocation: "",
        contractType: "CDI",
        reason: "REPLACEMENT",
        recruiterId: "",
        recruitmentSource: "",
        comments: "",
        status: "PENDING",
        justification: "N/A",
        jobCharacteristics: "N/A",
        candidateEducation: "N/A",
        candidateSkills: "N/A",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateVacantPosition(formData.id, formData);
            } else {
                await createVacantPosition(formData);
            }
            router.push("/vacant-positions");
            router.refresh();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save vacant position");
        }
    };

    return (
        <motion.div
            className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
            <motion.div
                className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 bg-gradient-to-r from-primary/5 to-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <motion.h3
                    className="font-semibold text-dark dark:text-white text-xl"
                    whileHover={{ scale: 1.05, x: 10 }}
                >
                    {isEdit ? "✏️ Edit Vacant Position" : "➕ Create Vacant Position"}
                </motion.h3>
            </motion.div>
            <form onSubmit={handleSubmit}>
                <motion.div
                    className="p-6.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="mb-4.5 flex flex-col gap-6 xl:flex-row"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="w-full xl:w-1/2">
                            <motion.label
                                className="mb-2.5 block text-black dark:text-white font-medium"
                                whileHover={{ x: 5 }}
                            >
                                Job Title <span className="text-red">*</span>
                            </motion.label>
                            <motion.input
                                type="text"
                                name="jobTitle"
                                required
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Enter job title"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <motion.label
                                className="mb-2.5 block text-black dark:text-white font-medium"
                                whileHover={{ x: 5 }}
                            >
                                Department <span className="text-red">*</span>
                            </motion.label>
                            <motion.input
                                type="text"
                                name="service"
                                required
                                value={formData.service}
                                onChange={handleChange}
                                placeholder="Enter department"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="mb-4.5 flex flex-col gap-6 xl:flex-row"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="w-full xl:w-1/2">
                            <motion.label
                                className="mb-2.5 block text-black dark:text-white font-medium"
                                whileHover={{ x: 5 }}
                            >
                                Recruiter
                            </motion.label>
                            <motion.select
                                name="recruiterId"
                                value={formData.recruiterId || ""}
                                onChange={handleChange}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                            >
                                <option value="">Select Recruiter</option>
                                {recruiters.map((recruiter) => (
                                    <option key={recruiter.id} value={recruiter.id}>
                                        {recruiter.username}
                                    </option>
                                ))}
                            </motion.select>
                        </div>

                        <div className="w-full xl:w-1/2">
                            <motion.label
                                className="mb-2.5 block text-black dark:text-white font-medium"
                                whileHover={{ x: 5 }}
                            >
                                Recruitment Source
                            </motion.label>
                            <motion.input
                                type="text"
                                name="recruitmentSource"
                                value={formData.recruitmentSource || ""}
                                onChange={handleChange}
                                placeholder="LinkedIn, Indeed, etc."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="mb-4.5"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <motion.label
                            className="mb-2.5 block text-black dark:text-white font-medium"
                            whileHover={{ x: 5 }}
                        >
                            Work Location <span className="text-red">*</span>
                        </motion.label>
                        <motion.input
                            type="text"
                            name="workLocation"
                            required
                            value={formData.workLocation}
                            onChange={handleChange}
                            placeholder="Enter location"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                        />
                    </motion.div>

                    <motion.div
                        className="mb-4.5"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <motion.label
                            className="mb-2.5 block text-black dark:text-white font-medium"
                            whileHover={{ x: 5 }}
                        >
                            Comments
                        </motion.label>
                        <motion.textarea
                            rows={4}
                            name="comments"
                            value={formData.comments || ""}
                            onChange={handleChange}
                            placeholder="Add comments"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(87, 80, 241, 0.1)" }}
                        ></motion.textarea>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(87, 80, 241, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                    >
                        {isEdit ? "💾 Update Position" : "✨ Create Position"}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    );
}
