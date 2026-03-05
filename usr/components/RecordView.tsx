import { useState, useEffect } from 'react';

interface Props {
  directusUrl: string;
  directusToken?: string;
}

export default function RecordView({ directusUrl, directusToken }: Props) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [table, setTable] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const actualTable = params.get('table') || '';
    const actualId = params.get('id') || '';
    const fields = params.get('fields') || '*.*.*';

    setTable(actualTable);
    setId(actualId);

    if (!actualTable || !actualId) {
      setError(true);
      setLoading(false);
      return;
    }

    const url = `${directusUrl}/items/${actualTable}/${actualId}?fields=${fields}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (directusToken) {
      headers['Authorization'] = `Bearer ${directusToken}`;
    }

    fetch(url, { headers })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setRecord(data.data ?? data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching record:', err);
        setError(true);
        setLoading(false);
      });
  }, [directusUrl, directusToken]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 font-semibold mb-2">Record Not Found</div>
          <div className="text-red-600 text-sm">
            No record found for table "{table}" with ID "{id}"
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-2 gap-8">

        {/* Site Name - Full width */}
        <div className="col-span-2">
          <h1 className="text-4xl font-bold mb-4">
            {record.Site_Name || `Record ${id}`}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Table: {table} | ID: {id}
          </p>
        </div>

        {/* Description Column */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {record.Description || 'No description available'}
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Additional Info</h3>
            <p className="text-sm text-gray-600">
              Survey Year: {record.Survey_Year || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              Creator: {record.Creator || 'N/A'}
            </p>
          </div>
        </div>

        {/* Location Column */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <div className="space-y-2">
            {record.Latitude && record.Longitude && (
              <div className="font-mono text-sm">
                <span className="font-semibold">Coordinates:</span>{' '}
                {record.Latitude}, {record.Longitude}
              </div>
            )}
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Context:</span> {record.Context_3 || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Setting:</span> {record.Setting || 'N/A'}
            </div>
          </div>
          {record.Thumbnail && (
            <div className="mt-4">
              <img
                src={record.Thumbnail}
                alt="Site thumbnail"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Additional sections */}
        <div className="col-span-2 mt-8">
          <h2 className="text-xl font-semibold mb-4">Site Details</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold">Item Category:</span> {record.Item_Category || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Site Number:</span> {record.Site_Number || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Survey Date:</span> {record.Survey_Date || 'N/A'}
            </div>
          </div>
          {record.Site_Description && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Site Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {record.Site_Description}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
