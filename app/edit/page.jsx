import AddSchoolForm from "@/components/AddSchoolForm";

export default async function EditSchoolPage({ searchParams }) {
  const { id } = await searchParams;

  if (!id) {
    return <div className="p-8">No school ID provided</div>;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/schools/${id}`,
    {
      cache: "no-store", // ensure fresh data
    }
  );

  const { data } = await response.json();

  if (!data) {
    return <h1>No Such ID present</h1>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AddSchoolForm edit={data} />
    </div>
  );
}
