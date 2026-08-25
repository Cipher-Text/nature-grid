/**
 * District <select> grouped by division via <optgroup>.
 * Server Component — no client JS needed.
 */

export interface DistrictWithDivision {
  id: string;
  name: string;
  division?: { id: string; name: string };
}

interface Props {
  districts: DistrictWithDivision[];
  id?: string;
  name?: string;
  emptyLabel?: string;
  defaultValue?: string;
  required?: boolean;
}

export default function DistrictSelect({
  districts,
  id = 'districtId',
  name = 'districtId',
  emptyLabel = 'Not specified',
  defaultValue,
  required,
}: Props) {
  // Group districts by division name
  const grouped = new Map<string, DistrictWithDivision[]>();
  for (const d of districts) {
    const divName = d.division?.name ?? 'Other';
    if (!grouped.has(divName)) grouped.set(divName, []);
    grouped.get(divName)!.push(d);
  }

  return (
    <select id={id} name={name} className="select-field" defaultValue={defaultValue} required={required}>
      {!required && <option value="">{emptyLabel}</option>}
      {[...grouped.entries()].map(([divisionName, divDistricts]) => (
        <optgroup key={divisionName} label={divisionName}>
          {divDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
