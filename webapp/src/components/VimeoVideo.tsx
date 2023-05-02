import "./vimeo-video.css";

type VimeoVideoProps = {
  video: string;
  width?: number;
  height?: number;
};

function VimeoVideo(props: VimeoVideoProps) {
  return (
    <div className="vimeo-full-width">
      <iframe
        title="Vimeo Video"
        id="vimeo-player"
        src={props.video}
        frameBorder={0}
        allowFullScreen
      />
    </div>
  );
}

export default VimeoVideo;
