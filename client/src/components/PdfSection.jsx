import React from "react";
import { useGetCourseByIdQuery } from "@/features/api/courseApi"; // adjust path

const PdfSection = ({ courseId }) => {
  const { data, isLoading, isError } = useGetCourseByIdQuery(courseId);

  if (isLoading) return <p>Loading PDFs...</p>;
  if (isError) return <p>Error loading PDFs</p>;

  const pdfs = data?.course?.pdfs || [];

  return (
    <div className="space-y-4">
      {pdfs.length === 0 ? (
        <p>No PDFs available for this course.</p>
      ) : (
        pdfs.map((pdf, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{pdf.title}</h3>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default PdfSection;
