// eslint-disable-next-line
import moment from 'moment';
import shortid from 'shortid';

// const test = [
//   {
//     start: '2020-08-28T16:00:00Z',
//     end: '2020-08-28T22:00:00Z',
//   },
//   {
//     start: '2020-08-28T10:00:00Z',
//     end: '2020-08-28T15:00:00Z',
//   },
//   {
//     start: '2020-08-26T14:56:55Z',
//     end: '2020-08-26T15:56:55Z',
//   },
//   {
//     start: '2020-08-27T13:56:55Z',
//     end: '2020-08-27T14:56:55Z',
//   },
//   {
//     start: '2020-08-28T17:11:55Z',
//     end: '2020-08-28T18:11:55Z',
//   },
//   {
//     start: '2020-08-29T11:56:55Z',
//     end: '2020-08-29T12:56:55Z',
//   },
//   {
//     start: '2020-08-30T10:56:55Z',
//     end: '2020-08-30T11:56:55Z',
//   },
//   {
//     start: '2020-08-27T00:56:55Z',
//     end: '2020-08-29T23:00:00Z',
//   },
// ];
//
// const endDate = '2020-08-25T15:00:00Z';

// eslint-disable-next-line
function overlap(timeSegOne, timeSegTwo){
  if (timeSegOne.end.isSameOrBefore(timeSegTwo.start) || timeSegTwo.end.isSameOrBefore(timeSegOne.start)) {
    return false;
  } else {
    return true;
  }
}
// eslint-disable-next-line
function increment(timeSegment) {
  timeSegment.start.add(15, 'minutes');
  timeSegment.end.add(15, 'minutes');
}
// eslint-disable-next-line
function goodSegment(timeSegment, busyTimes) {
  const startTime = timeSegment.start;
  const endTime = timeSegment.end;
  const compareStart = timeSegment.start.clone();
  const compareEnd = timeSegment.end.clone();
  compareStart.hours(7);
  compareEnd.hours(23);
  if (startTime.isSameOrBefore(compareStart)) {
    return false;
  }
  if (endTime.isSameOrAfter(compareEnd)) {
    return false;
  } else {
    console.log(`passed endTime: ${endTime}`);
  }
  for (let i = 0; i < busyTimes.length; i += 1) {
    if (overlap(timeSegment, busyTimes[i])) {
      return false;
    }
  }
  console.log(`passed busyTime: ${endTime}`);
  return true;
}

export default function recommendTimes(timeToAssign, busy, dueDate) {
  const timeToAssignInt = Math.ceil(timeToAssign);
  if (timeToAssignInt < 0) {
    return [];
  }
  // eslint-disable-next-line
  const deadline = moment(dueDate);
  if (deadline.isBefore(moment())) {
    return [];
  }
  moment.relativeTimeThreshold('h', +Infinity);
  const totalTime = deadline.fromNow(true).split(' ')[0];
  const distribution = totalTime / timeToAssignInt;
  console.log(`Distribution: ${distribution}`);
  const busyTimes = [];
  const recommendations = [];
  for (let i = 0; i < busy.length; i += 1) {
    const busyBlock = {
      start: moment(busy[i].start),
      end: moment(busy[i].end),
    };
    busyTimes.push(busyBlock);
  }
  const rootRecommendation = {
    start: moment(),
    end: moment().add(1, 'hours'),
  };
  const recommendation = {
    start: moment(),
    end: moment().add(1, 'hours'),
  };
  for (let i = 0; i < timeToAssignInt; i += 1) {
    for (let j = 0; j < (distribution - 1) * 4; j += 1) {
      if (goodSegment(recommendation, busyTimes)) {
        recommendations.push({ start: recommendation.start.clone().toDate(), end: recommendation.end.clone().toDate() });
        busyTimes.push({ start: recommendation.start.clone(), end: recommendation.end.clone() });
        break;
      } else {
        increment(recommendation);
      }
    }
    rootRecommendation.start.add(Math.floor(distribution), 'hours');
    rootRecommendation.end.add(Math.floor(distribution), 'hours');
    recommendation.start = rootRecommendation.start.clone();
    recommendation.end = rootRecommendation.end.clone();
  }
  const backupRecommendation = {
    start: moment(),
    end: moment().add(1, 'hours'),
  };
  while (recommendations.length !== timeToAssignInt && backupRecommendation.end.isBefore(deadline)) {
    if (goodSegment(backupRecommendation, busyTimes)) {
      recommendations.push({ start: backupRecommendation.start.clone().toDate(), end: backupRecommendation.end.clone().toDate() });
      busyTimes.push({ start: backupRecommendation.start.clone(), end: backupRecommendation.end.clone() });
    }
    increment(backupRecommendation);
  }
  if (recommendations.length !== timeToAssignInt) {
    return [];
  }
  return recommendations.map((rec) => ({ ...rec, id: shortid.generate() }));
}

// console.log(recommendTimes(5, test, endDate));
