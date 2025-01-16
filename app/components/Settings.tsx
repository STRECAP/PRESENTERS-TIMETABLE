interface SettingsProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export default function Settings({ soundEnabled, setSoundEnabled }: SettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="soundToggle"
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="soundToggle">Enable Sound Effects</label>
      </div>
    </div>
  )
}

