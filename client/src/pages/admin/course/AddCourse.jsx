import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState('');
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => setCategory(value);

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await createCourse({ courseTitle, category }).unwrap();
      toast.success(response.message || 'Course created.');
      navigate('/admin/course');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create course.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-3xl font-bold">Create a New Course</h1>
        <p className="text-gray-400 text-sm">
          Add basic details to get started with your course creation.
        </p>
      </div>

      <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md">
        <div className="space-y-2">
          <Label className="text-gray-200">Course Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter the course name"
            className="bg-white/10 border border-white/20 placeholder:text-gray-400 focus-visible:ring-blue-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200">Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] text-white border-white/20">
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {[
                  'Next JS',
                  'Data Science',
                  'Frontend Development',
                  'Fullstack Development',
                  'MERN Stack Development',
                  'Javascript',
                  'Python',
                  'Docker',
                  'MongoDB',
                  'HTML'
                ].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/course')}
            className="w-1/2 text-black dark:text-white"
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            onClick={createCourseHandler}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
