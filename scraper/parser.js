const url = require('url');

const parseTextBoard = async (browserPage) => {
  await browserPage.waitForSelector('.text-board');

  return browserPage.$eval(
    '.text-board',
    (textBoard) => {
      const rawAnnouncements = Array.from(textBoard.querySelectorAll('tbody > tr'));

      return rawAnnouncements.map((announcement) => {
        const subject = announcement.querySelector('.subject > a');

        const parsed = {
          id: `ugrad-${announcement.querySelector('.index').innerHTML}`,
          title: subject.innerHTML.trim(),
          link: subject.href,
        };
        return parsed;
      });
    },
  );
};

const parseAnnouncement = async (browserPage, announcement) => {
  await browserPage.goto(announcement.link);
  await browserPage.waitForSelector('.text-view-board');

  const result = await browserPage.$eval(
    '.text-view-board',
    (textViewBoard) => {
      const title = textViewBoard.querySelector('td.subject-value').innerText.trim();
      const content = textViewBoard.querySelector('td.content > div').innerText.trim();

      return {
        title, content,
      };
    },
  );

  return { id: announcement.id, link: announcement.link, ...result };
};

const parseBoardTable = async (browserPage) => {
  await browserPage.waitForSelector('.board-table');

  const announcements = await browserPage.$eval(
    '.board-table',
    (tableWrap) => {
      const rawAnnouncements = Array.from(tableWrap.querySelectorAll('tbody > tr'));
      return rawAnnouncements.map((announcement) => {
        const subject = announcement.querySelector('.title > a');

        const parsed = {
          title: subject.innerText.trim(),
          link: subject.href,
        };
        return parsed;
      });
    },
  );
  return announcements.map((ann) => {
    const params = url.parse(ann.link, true);
    return {
      id: `grad-${params.query.articleNo}`,
      ...ann,
    };
  });
};

const parseGraduateAnnouncement = async (browserPage, announcement) => {
  await browserPage.goto(announcement.link);
  await browserPage.waitForSelector('.board_view');

  const result = await browserPage.$eval(
    '.board_view',
    (boardView) => {
      const title = boardView.querySelector('.view_tit > p').innerText.trim();
      const content = boardView.querySelector('.cont_inner').innerText.trim();

      return {
        title, content,
      };
    },
  );

  return { id: announcement.id, link: announcement.link, ...result };
};

module.exports = {
  parseTextBoard, parseAnnouncement, parseBoardTable, parseGraduateAnnouncement,
};
