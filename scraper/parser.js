const parseTextBoard = (browserPage) => browserPage.$eval(
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
    const title = textViewBoard.querySelector('td.subject-value').innerText.trim();
    const writer = textViewBoard.querySelector('td.writer').innerText.trim();
    const date = `${textViewBoard.querySelector('td.date').innerText.trim()} KST`;
    const content = textViewBoard.querySelector('td.content > div').innerText;

    return {
      title, writer, date, content,
    };
  },
);

module.exports = { parseTextBoard, parseAnnouncement };
