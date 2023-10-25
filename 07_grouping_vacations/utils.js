export function groupVacations(data) {
  const problems = [];
  const users = {};
  data.forEach((vacation) => {
    if (users[vacation.user._id]) {
      if (users[vacation.user._id].userName !== vacation.user.name)
        problems.push({ vacId: vacation._id, userId: vacation.user._id });
      users[vacation.user._id].vacations.push({
        startDate: vacation.startDate,
        endDate: vacation.endDate,
      });
    } else {
      users[vacation.user._id] = {
        userName: vacation.user.name,
        vacations: [
          { startDate: vacation.startDate, endDate: vacation.endDate },
        ],
      };
    }
  });
  const result = Object.entries(users).map(([key, value]) => ({
    userId: key,
    ...value,
  }));
  if (problems.length) {
    console.error("Duplicated id occured", problems);
  }
  return result;
}
