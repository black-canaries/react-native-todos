export const isToday = (date: string): boolean => {
  const taskDate = new Date(date);
  const today = new Date();
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date: string): boolean => {
  const taskDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    taskDate.getDate() === tomorrow.getDate() &&
    taskDate.getMonth() === tomorrow.getMonth() &&
    taskDate.getFullYear() === tomorrow.getFullYear()
  );
};

export const isOverdue = (date: string): boolean => {
  const taskDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < today;
};

export const formatDueDate = (date: string): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';

  const taskDate = new Date(date);
  const today = new Date();
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7 && diffDays > 0) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[taskDate.getDay()];
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[taskDate.getMonth()]} ${taskDate.getDate()}`;
};

export const getUpcomingTasks = (tasks: any[]): any[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate <= nextWeek;
  });
};

export const getTodayTasks = (tasks: any[]): any[] => {
  return tasks.filter(task => task.dueDate && isToday(task.dueDate));
};
