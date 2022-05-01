const parseTextBoard = async (browserPage) => browserPage.$eval(
  '.text-board',
  (textBoard) => {
    const rawAnnouncements = Array.from(textBoard.querySelectorAll('tbody > tr'));

    return rawAnnouncements.map((announcement) => {
      const subject = announcement.querySelector('.subject > a');

      const parsed = {
        id: announcement.querySelector('.index').innerHTML,
        title: subject.innerHTML.trim(),
        link: subject.href,
      };
      return parsed;
    });
  },
);

const parseAnnouncement = async (browserPage) => browserPage.$eval(
  '.text-view-board',
  (textViewBoard) => {
    const title = textViewBoard.querySelector('td.subject-value').innerHTML.trim();
    const writer = textViewBoard.querySelector('td.writer').innerHTML.trim();
    const date = `${textViewBoard.querySelector('td.date').innerHTML.trim()} KST`;
    const rawContent = textViewBoard.querySelector('td.content > div').innerHTML;

    return {
      title, writer, date, rawContent,
    };
  },
);

module.exports = { parseTextBoard, parseAnnouncement };
