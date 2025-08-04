import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);

    const { courseId, lectureId } = useParams();
    const navigate = useNavigate();

    const {
        data: lectureData,
        isLoading: lectureLoading,
        error: lectureError,
    } = useGetLectureByIdQuery({ courseId, lectureId });


    const lecture = lectureData?.lecture;

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { isLoading: removeLoading }] = useRemoveLectureMutation();

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle || "");
            setIsFree(Boolean(lecture.isPreviewFree));
            setUploadVideoInfo({
                videoUrl: lecture.videoUrl,
                publicId: lecture.publicId,
            });
        }
    }, [lecture]);

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                });
                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Video upload failed.");
            } finally {
                setMediaProgress(false);
            }
        }
    };

    const editLectureHandler = async () => {
        try {
            const res = await editLecture({
                lectureTitle,
                videoInfo: uploadVideoInfo,
                isPreviewFree: isFree,
                courseId,
                lectureId,
            }).unwrap();

            toast.success(res.message || "Lecture updated successfully!");
            navigate(`/admin/course/${courseId}/lecture`); // ✅ redirect after update
        } catch (err) {
            console.error(err);
            toast.error("Failed to update lecture");
        }
    };

    const removeLectureHandler = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this lecture?");
        if (!confirmDelete) return;

        try {
            const res = await removeLecture({ courseId, lectureId }).unwrap();
            toast.success(res.message || "Lecture deleted successfully!");
            navigate(`/admin/course/${courseId}/lecture`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove lecture.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error]);

    if (lectureLoading) return <p className="text-center">Loading lecture details...</p>;

    if (lectureError) {
        console.error(lectureError);
        return <p className="text-red-500 text-center">Failed to load lecture data. Please try again.</p>;
    }

    if (!lectureData?.lecture) return <p className="text-center text-gray-500">Lecture not found.</p>;


    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and click save when done</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
                        {removeLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                please wait
                            </>
                        ) : "Remove Lecture"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        placeholder="Ex. introduction to javascript."
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>

                <div className='my-5'>
                    <Label>Video<span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        className="w-fit"
                        onChange={fileChangeHandler}
                    />
                    {/* ✅ Show video preview if uploaded already */}
                    {uploadVideoInfo?.videoUrl && (
                        <div className="mt-3">
                            <video
                                src={uploadVideoInfo.videoUrl}
                                controls
                                className="rounded-lg w-full max-w-md"
                            />
                            <p className="text-sm text-gray-400 mt-1">Previously uploaded video</p>
                        </div>
                    )}

                </div>

                <div className='flex items-center space-x-2 my-5'>
                    <Switch id="airplane-mode" checked={isFree} onCheckedChange={setIsFree} />
                    <Label htmlFor="airplane-mode">Is this video Free</Label>
                </div>

                {mediaProgress && (
                    <div className='my-4'>
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <div className='mt-4'>
                    <Button disabled={mediaProgress || isLoading} onClick={editLectureHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                please wait
                            </>
                        ) : "Update Lecture"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LectureTab;
