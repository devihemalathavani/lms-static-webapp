import { useMatch } from "@tanstack/react-location";
import { useState } from "react";
import VimeoVideo from "../components/VimeoVideo";
import { LocationGenerics } from "../routes";
import { Helmet } from "react-helmet";
import clsx from "clsx";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";
import useGetCourse from "../hooks/useGetCourse";
import CourseInformationTabs from "../components/CourseInformationTabs";
import { Topic } from "../types/courses";
import { getOrderedModules } from "../lib/utils";

function Course() {
  const match = useMatch<LocationGenerics>();
  // const { videoContainerRef, width, height } = useElementSize();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const { data } = useGetCourse(match.params.courseId, {
    onSuccess(data) {
      const modules = data?.modules || [];
      const lastModule = modules.at(-1);
      setOpenChapters(lastModule ? [lastModule.id] : []);
    },
  });

  const toggleChapter = (chapterId: number) => {
    if (openChapters.includes(chapterId)) {
      setOpenChapters(openChapters.filter((id) => id !== chapterId));
      return;
    }

    setOpenChapters([...openChapters, chapterId]);
  };

  const toggleTopic = (topic: Topic) => {
    setSelectedTopic(selectedTopic?.id === topic.id ? null : topic);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
      </Helmet>
      <h1 className="pt-6 text-center text-3xl font-bold capitalize">
        {data.title}
      </h1>
      <div className="p-4">
        <div className="flex h-[75vh] space-x-8 p-4">
          <div className="prose w-2/6 overflow-auto border border-t-0">
            {/* Index */}
            {getOrderedModules(data.modules, data.modulesOrder).map(
              (module, moduleIndex) => (
                <div key={module.id} className="flex flex-col">
                  <button
                    onClick={() => toggleChapter(module.id)}
                    className="text-start flex w-full items-center justify-between border-t p-3"
                  >
                    <div className="flex items-center justify-center text-black">
                      <div className="badge badge-primary mr-2 aspect-square text-xs">
                        <span>{moduleIndex + 1}</span>
                      </div>
                      {module.title}
                    </div>
                    <label
                      className={clsx("swap", {
                        "swap-active": openChapters.includes(module.id),
                      })}
                    >
                      <FaAngleUp className={"swap-on"} />
                      <FaAngleDown className={"swap-off"} />
                    </label>
                  </button>
                  {module.topics.map((topic, topicIndex) => (
                    <button
                      onClick={() => toggleTopic(topic)}
                      key={topic.id}
                      className={clsx(
                        {
                          "hidden transition-opacity": !openChapters.includes(
                            module.id
                          ),
                        },
                        selectedTopic?.id === topic.id
                          ? "text-primary"
                          : "bg-gray-50",
                        "text-start hover:text-primary flex w-full items-center justify-between border-t p-3"
                      )}
                    >
                      <div className="flex items-center justify-center pl-6">
                        <div
                          className={clsx(
                            "badge badge-primary mr-2 aspect-square text-xs",
                            selectedTopic?.id === topic.id
                              ? "badge-success"
                              : "badge-outline"
                          )}
                        >
                          <span>{topicIndex + 1}</span>
                        </div>
                        {topic.title}
                      </div>
                      <label
                        className={clsx("swap", {
                          "swap-active": selectedTopic?.id === topic.id,
                        })}
                      >
                        <FaPauseCircle className={"swap-on"} />
                        <FaPlayCircle className={"swap-off"} />
                      </label>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="w-[70vw]">
            {selectedTopic?.videoLink ? (
              <VimeoVideo video={selectedTopic?.videoLink} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <h1 className="text-2xl">Select a topic to start watching</h1>
              </div>
            )}
          </div>
        </div>
        <div className="pt-8">
          <CourseInformationTabs topicId={selectedTopic?.id} course={data} />
        </div>
      </div>
    </>
  );
}

export default Course;
