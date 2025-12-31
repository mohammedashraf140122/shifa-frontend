/**
 * StepHeader Component
 * Displays step number and title in the multi-step modal
 */
export default function StepHeader({ stepNumber, title, active }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold
          ${active ? "bg-primary text-white" : "bg-grayMedium dark:bg-gray-700 text-grayTextLight dark:text-gray-400"}
        `}
      >
        {stepNumber}
      </div>

      <h2
        className={`text-base font-semibold ${
          active ? "text-grayTextDark dark:text-white" : "text-grayTextLight dark:text-gray-400"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}





