
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const skillsData = [
  {
    category: "Technical",
    skills: [
      { name: "Python", students: 42, expertLevel: 12, growth: 15 },
      { name: "JavaScript", students: 38, expertLevel: 9, growth: 12 },
      { name: "React", students: 29, expertLevel: 7, growth: 18 },
      { name: "Machine Learning", students: 24, expertLevel: 5, growth: 22 },
      { name: "Data Analysis", students: 36, expertLevel: 8, growth: 10 },
    ]
  },
  {
    category: "Soft Skills",
    skills: [
      { name: "Communication", students: 46, expertLevel: 14, growth: 8 },
      { name: "Teamwork", students: 49, expertLevel: 15, growth: 5 },
      { name: "Problem Solving", students: 41, expertLevel: 11, growth: 12 },
      { name: "Critical Thinking", students: 39, expertLevel: 10, growth: 9 },
      { name: "Presentation", students: 32, expertLevel: 8, growth: 14 },
    ]
  }
];

const topStudentsBySkill = [
  { 
    skill: "Python", 
    students: [
      { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=12", level: 94 },
      { name: "Emma Garcia", avatar: "https://i.pravatar.cc/150?img=25", level: 92 },
      { name: "David Kim", avatar: "https://i.pravatar.cc/150?img=8", level: 89 }
    ] 
  },
  { 
    skill: "React", 
    students: [
      { name: "Ava Williams", avatar: "https://i.pravatar.cc/150?img=24", level: 96 },
      { name: "Noah Taylor", avatar: "https://i.pravatar.cc/150?img=67", level: 90 },
      { name: "Emily Chang", avatar: "https://i.pravatar.cc/150?img=32", level: 87 }
    ] 
  },
  { 
    skill: "Machine Learning", 
    students: [
      { name: "Ethan Brown", avatar: "https://i.pravatar.cc/150?img=59", level: 95 },
      { name: "Sophia Adams", avatar: "https://i.pravatar.cc/150?img=47", level: 88 },
      { name: "Ryan Thompson", avatar: "https://i.pravatar.cc/150?img=50", level: 85 }
    ] 
  }
];

export function Skills() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Student Skills</h2>
        <p className="text-muted-foreground mb-6">Track and analyze skill development across the student body</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Skills Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-uprit-indigo">24</div>
            <p className="text-sm text-muted-foreground">Across technical and soft skill categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-uprit-purple">Teamwork</div>
            <p className="text-sm text-muted-foreground">49 students proficient</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fastest Growing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Machine Learning</div>
            <p className="text-sm text-muted-foreground">+22% growth this semester</p>
          </CardContent>
        </Card>
      </div>
      
      {skillsData.map(category => (
        <Card key={category.category} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle>{category.category} Skills</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Skill</th>
                  <th className="px-6 py-3 text-center">Students</th>
                  <th className="px-6 py-3 text-center">Expert Level</th>
                  <th className="px-6 py-3 text-center">Growth</th>
                  <th className="px-6 py-3 text-right">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {category.skills.map(skill => (
                  <tr key={skill.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{skill.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">{skill.students}</td>
                    <td className="px-6 py-4 text-center">{skill.expertLevel}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">+{skill.growth}%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Progress value={(skill.students / 50) * 100} className="w-32 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
      
      <h3 className="text-xl font-semibold mt-8 mb-4">Top Performers by Skill</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStudentsBySkill.map(item => (
          <Card key={item.skill}>
            <CardHeader>
              <CardTitle className="text-lg">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-2">
                  {item.skill}
                </Badge>
                <div>Top Students</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {item.students.map((student, index) => (
                  <li key={student.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-full text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{student.name}</div>
                    </div>
                    <div className="text-sm font-semibold">{student.level}%</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
