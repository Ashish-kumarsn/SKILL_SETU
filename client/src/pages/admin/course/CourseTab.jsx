import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useDeleteCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import SeeFeedback from "@/components/Feedback/SeeFeedback";


const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: ""
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  useEffect(() => {
    if (courseByIdData?.course) {
      const c = courseByIdData.course;
      setInput({
        courseTitle: c.courseTitle,
        subTitle: c.subTitle,
        description: c.description,
        category: c.category,
        courseLevel: c.courseLevel,
        coursePrice: c.coursePrice,
        courseThumbnail: ""
      });
    }
  }, [courseByIdData]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => setInput(prev => ({ ...prev, category: value }));
  const selectCourseLevel = (value) => setInput(prev => ({ ...prev, courseLevel: value }));

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput(prev => ({ ...prev, courseThumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    if (!input.courseTitle || !input.category || !input.courseLevel) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await editCourse({ formData, courseId });
  };

  const removeCourseHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await deleteCourse(courseId);
      if (res?.data?.message) {
        toast.success(res.data.message);
        navigate("/admin/course");
      } else toast.error("Failed to delete course.");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const publishStatusHandler = async (action) => {
    console.log("🟡 Publish handler triggered");
    console.log("📦 courseId:", courseId);
    console.log("📤 action (publish?):", action);

    try {
      const res = await publishCourse({ courseId, publish: action });
      console.log("✅ Publish API response:", res); // Log the response

      if (res.data) {
        refetch();
        toast.success(res.data.message);
      } else {
        toast.error("No data received.");
      }
    } catch (error) {
      console.log("❌ Error in publishCourse mutation:", error); // If there's an error
      toast.error("Failed to publish/unpublish.");
    }
  };


  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated.");
      navigate("/admin/course");
    }
    if (error) toast.error(error?.data?.message || "Failed to update.");
  }, [isSuccess, error]);

  if (courseByIdLoading) return <h1 className="text-center text-white">Loading course data...</h1>;

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-lg text-white">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-lg md:text-2xl text-white">Course Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Edit basic details about your course and manage publishing.
          </CardDescription>
        </div>
        <div className="flex gap-3 text-black dark:text-white">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            variant="outline"
            onClick={() => {
              console.log("🖱️ Publish button clicked");
              publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true");
            }}

          >
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={removeCourseHandler}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...
              </>
            ) : "Remove Course"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label>Title</Label>
          <Input name="courseTitle" value={input.courseTitle} onChange={changeHandler} placeholder="Ex. Fullstack Web Dev Bootcamp" />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input name="subTitle" value={input.subTitle} onChange={changeHandler} placeholder="Ex. Learn from zero to deployment" />
        </div>
        <div>
          <Label>Description</Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={input.category} onValueChange={selectCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Popular</SelectLabel>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">Frontend</SelectItem>
                  <SelectItem value="Fullstack Development">Fullstack</SelectItem>
                  <SelectItem value="MERN Stack Development">MERN Stack</SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Course Level</Label>
            <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Advance">Advance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price (₹)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeHandler}
              placeholder="e.g. 999"
            />
          </div>
        </div>

        <div>
          <Label>Thumbnail</Label>
          <Input type="file" onChange={selectThumbnail} accept="image/*" />
          {(previewThumbnail || courseByIdData?.course.courseThumbnail) && (
            <img
              src={previewThumbnail || courseByIdData.course.courseThumbnail}
              alt="Thumbnail"
              className="mt-3 w-64 rounded-lg shadow-md"
            />
          )}
        </div>

        <div className="flex gap-3 text-black dark:text-white">
          <Button onClick={() => navigate("/admin/course")} variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={updateCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
