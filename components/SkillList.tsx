
import React from 'react';

interface SkillListProps {
  title: string;
  skills: string[];
  icon: React.ReactNode;
}

const SkillList: React.FC<SkillListProps> = ({ title, skills, icon }) => (
  <div>
    <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    {skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>
    ) : (
       <p className="text-sm text-gray-500 dark:text-gray-400 italic">None to display.</p>
    )}
  </div>
);

export default SkillList;
