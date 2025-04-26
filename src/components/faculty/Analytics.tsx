import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart } from "@/components/ui/charts";

export function Analytics() {
  // Sample data for charts
  const studentPerformanceData = {
    labels: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Midterm', 'Final Project'],
    datasets: [
      {
        label: 'Class Average',
        data: [78, 82, 74, 88, 85],
        backgroundColor: '#9b87f5',
      }
    ]
  };

  const gradeDistributionData = {
    labels: ['A', 'B', 'C', 'D', 'F'],
    datasets: [
      {
        data: [30, 40, 15, 10, 5],
        backgroundColor: ['#6E59A5', '#9b87f5', '#D6BCFA', '#E5DEFF', '#F1F0FB'],
      }
    ]
  };

  const attendanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [95, 90, 88, 92, 87, 89, 94, 91],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        tension: 0.3,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Course Analytics</h2>
        <p className="text-muted-foreground mb-6">Track student performance, participation, and engagement</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <CardTitle className="text-lg mb-4">Performance Metrics</CardTitle>
          <CardContent className="p-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Average Grade</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Participation Rate</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Assignment Completion</span>
                <span className="font-semibold">89%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Top Performers</span>
                <span className="font-semibold">12 students</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-4">
          <CardTitle className="text-lg mb-4">At-Risk Students</CardTitle>
          <CardContent className="p-0">
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-sm">James Brown</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Missing 3 assignments</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Emma Garcia</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Grade below 60%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Ryan Thompson</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Low participation</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Sophia Adams</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Attendance issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="p-4">
          <CardTitle className="text-lg mb-4">Engagement Summary</CardTitle>
          <CardContent className="p-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Forum Posts</span>
                <span className="font-semibold">127 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Questions Asked</span>
                <span className="font-semibold">56 questions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Office Hour Attendance</span>
                <span className="font-semibold">34 students</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Active Participants</span>
                <span className="font-semibold">85% of class</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <CardTitle className="text-lg mb-4">Assignment Performance</CardTitle>
          <CardContent className="p-0 h-64">
            <BarChart data={studentPerformanceData} />
          </CardContent>
        </Card>
        
        <Card className="p-4">
          <CardTitle className="text-lg mb-4">Grade Distribution</CardTitle>
          <CardContent className="p-0 h-64 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <PieChart data={gradeDistributionData} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="p-4">
        <CardTitle className="text-lg mb-4">Attendance Trends</CardTitle>
        <CardContent className="p-0 h-64">
          <LineChart data={attendanceData} />
        </CardContent>
      </Card>
    </div>
  );
}
