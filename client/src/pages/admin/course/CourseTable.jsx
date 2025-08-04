import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { Edit, Plus, BookOpen, DollarSign, Eye } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseTable = () => {
    const { data, isLoading } = useGetCreatorCourseQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Management</h1>
                            <p className="text-gray-600 dark:text-gray-400">A list of your recent Courses.</p>
                        </div>
                        <Button 
                            onClick={() => navigate(`create`)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create a new course
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Courses</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.courses?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                                <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Published</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data?.courses?.filter(course => course.isPublished).length || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
                                <Eye className="w-6 h-6 text-green-500 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${data?.courses?.reduce((sum, course) => sum + (course.coursePrice || 0), 0) || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                                <DollarSign className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Courses</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10">
                                    <th className="text-left text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 w-[100px]">Price</th>
                                    <th className="text-left text-gray-700 dark:text-gray-300 font-semibold py-4">Status</th>
                                    <th className="text-left text-gray-700 dark:text-gray-300 font-semibold py-4">Title</th>
                                    <th className="text-right text-gray-700 dark:text-gray-300 font-semibold py-4 pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.courses?.map((course) => (
                                    <tr 
                                        key={course._id} 
                                        className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                                            {course?.coursePrice || "NA"}
                                        </td>

                                        <td className="py-4">
                                            <Badge className={`$ {
                                                course.isPublished 
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                                                    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                                            } font-medium px-3 py-1 rounded-full border border-transparent`}> 
                                                {course.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                        </td>

                                        <td className="py-4 text-gray-900 dark:text-white font-medium">
                                            {course.courseTitle}
                                        </td>

                                        <td className="py-4 text-right pr-6">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => navigate(`${course._id}`)}
                                                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseTable;