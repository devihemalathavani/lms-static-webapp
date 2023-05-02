import DownloadFile from "./DownloadFile";

type ResumesProps = {
  resumeFiles?: string[];
};

function Resumes(props: ResumesProps) {
  if (!props.resumeFiles?.length) {
    return (
      <div className="prose">
        <p>No resume templates are updated for this course.</p>
      </div>
    );
  }

  return (
    <div className="prose">
      <ul>
        {props.resumeFiles.map((file, index) => (
          <li key={index}>
            <DownloadFile
              azureFileUrl={file}
              className="link link-primary p-0 m-0"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Resumes;
