import useGetCourses from "../hooks/useGetCourses";
import CourseCard from "../components/CourseCard";
import Text from "../components/Text";
import { Helmet } from "react-helmet";
import Banner from "../components/Banner";

function Dashboard() {
  const coursesQuery = useGetCourses();

  if (!coursesQuery.data) {
    return null;
  }

  if (coursesQuery.data.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Courses</title>
        </Helmet>
        <Banner />
        <div className="mx-auto max-w-4xl py-8 text-center">
          <Text>
            <h3>Enrolled courses will appear here.</h3>
            <p>
              If you are enrolled in a course but it is not listed here, please
              contact support using live chat for assistance.
            </p>
          </Text>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Courses</title>
      </Helmet>
      <Banner />
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <Text className="py-4">
          <h1>Your Courses</h1>
        </Text>
        {coursesQuery.data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}

export default Dashboard;
