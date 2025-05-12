'use client';
import { useState, useEffect } from 'react';

export type JobType = {
  id: number;
  title: string;
  category: string;
  salary: number;
};

export default function Home() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [view, setView] = useState<'search' | 'post'>('search');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  const allCategories = [
    '事務', 'エンジニア', '営業', 'デザイン', 'マーケティング',
    '財務・経理', '人事', 'カスタマーサポート', '製造', '医療・介護'
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/jobs');
      if (!res.ok) {
        console.error('データ取得失敗');
        return;
      }
      const { jobs } = await res.json();
      setJobs(jobs);
    };

    fetchJobs();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCategory || !newJobSalary) {
      alert('すべての項目を入力してください');
      return;
    }

    const newJob = {
      title: newJobTitle,
      category: newJobCategory,
      salary: Number(newJobSalary),
    };

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob),
    });

    if (!res.ok) {
      alert('投稿に失敗しました');
      return;
    }

    const data = await res.json();
    setJobs((prev) => [data, ...prev]);
    setNewJobTitle('');
    setNewJobCategory('');
    setNewJobSalary('');
    setView('search');
    setCurrentPage(1);
  };

  const handleCheckboxChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMinSalary(value ? Number(value) : null);
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter((job) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const salaryMatch = minSalary === null || job.salary >= minSalary;
    return categoryMatch && salaryMatch;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  return (
    <div>
    {/* ヘッダー */}
    <header className="bg-blue-950 text-white p-5">
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">求人検索アプリ</div>
        <nav className="space-x-4 text-sm">
          <button onClick={() => setView('search')} className="hover:underline">求人検索</button>
          <button onClick={() => setView('post')} className="hover:underline">求人投稿</button>
        </nav>
      </div>
    </header>

    {view === 'search' && (
    //求人検索アプリから下
    <main className="flex-1 flex">
      {/* サイドフィルター左 */}
      <aside className="bg-gray-200 p-4 w-1/4 overflow-y-auto">
        <h2 className="text-sm font-bold mb-2 text-black">求人カテゴリ</h2>
        <ul className="space-y-2">
          {allCategories.map((cat) => (
            <li key={cat} className="flex items-center">
  <input
    type="checkbox"
    id={cat}
    onChange={() => handleCheckboxChange(cat)}
    checked={selectedCategories.includes(cat)}
    className="appearance-none h-4 w-4 mr-2 border border-blue-400
               bg-gray-200 checked:bg-blue-400 checked:border-blue-400"
  />
  <label htmlFor={cat} className="text-xs text-gray-700">{cat}</label>
</li>

          ))}
        </ul>

        <div className="mt-6">
  <label htmlFor="salarySelect" className="text-sm font-bold mb-2 block text-black">
    年収
  </label>
  <select
    id="salarySelect"
    onChange={handleSalaryChange}
    className="w-full px-2 py-1 border border-gray-400 text-xs bg-white"
  >
    <option value="300">300万円以上 ▼</option>
    <option value="400">400万円以上 ▼</option>
    <option value="500">500万円以上 ▼</option>
    <option value="600">600万円以上 ▼</option>
    <option value="700">700万円以上 ▼</option>
    <option value="800">800万円以上 ▼</option>
  </select>
</div>

      </aside>

      {/* メイン表示右枠 */}
      <section className="flex-1 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">求人一覧</h2>
        <p className="text-xs mb-4 text-gray-600">該当件数: {filteredJobs.length}件</p>

        <div className="grid grid-cols-1 gap-4">
          {currentJobs.map((job) => (
            <div
            key={job.id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white flex flex-col justify-start space-y-1">
              <h3 className="font-bold text-sm mb-1">{job.title}</h3>
              <p className="text-xs text-gray-600">カテゴリ: {job.category}</p>
              <p className="text-xs text-gray-600">年収: {job.salary}万円</p>
            </div>
          ))}
        </div>
{/*ページ */}
<div className="mt-6 flex justify-center items-center space-x-2 text-sm">
  <button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    ◀︎
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`${
        currentPage === i + 1
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
  >
    ▶︎
  </button>
</div>
</section>
</main>
    )}
{view === 'post' && (
     <section className="p-6">
       <h2 className="text-lg font-bold text-gray-800 mb-4">求人投稿</h2>
       <form className="space-y-4 max-w-md" onSubmit={handlePostSubmit}>
  <div>
  <label htmlFor="job-category" className="block text-xs mb-1">求人カテゴリ選択</label>
<select
  id="job-category"
  value={newJobCategory}
  onChange={(e) => setNewJobCategory(e.target.value)}
  className="w-1/3 px-3 py-2 bg-white border border-gray-300 text-sm appearance-none"
>

      <option>カテゴリを選択 ▼</option>
      {allCategories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>

  <div>
  <label htmlFor="salary" className="block text-xs text-gray-600 mb-1">年収（万円）</label>
<select
  id="salary"
  value={newJobSalary}
  onChange={(e) => setNewJobSalary(e.target.value)}
  className="w-1/3 px-3 py-2 bg-white border border-gray-300 text-sm appearance-none"
>

  <option value=""> </option>
  {Array.from({ length: 10 }, (_, i) => (i + 1) * 100).map((amount) => (
    <option key={amount} value={amount}>
      {amount} 万円
    </option>
  ))}
</select>

  </div>

{/*求人投稿 */}
  <div>
  <label htmlFor="job-title" className="block text-xs text-gray-600 mb-1">求人タイトル</label>
<input
  id="job-title"
  type="text"
  value={newJobTitle}
  onChange={(e) => setNewJobTitle(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 text-sm"
/>

  </div>

  <button type="submit" className=" w-1/3 bg-blue-400 text-white px-4 py-2 rounded text-sm hover:bg-blue-300">
    投稿
  </button>
</form>
     </section>
   )}
 </div>
);
}