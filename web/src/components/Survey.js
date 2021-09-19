import { useFormik } from "formik";

function BasicForm() {
  const formik = useFormik({
    initialValues: {
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
    },
    onSubmit: (values) => {
        fetch("http://localhost:5000/questionnaire", {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(values)
        }).then(response => response.json())
        .then(data => {
          console.log('Success', data)
        })
        .catch(error => console.log('Failure', error))
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full bg-gray-100">
            <h1 className="mb-8 text-3xl text-center">Resource Questionnaire</h1>
            <label>Do you plan on evacuating?</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
              name="question1"
              {...formik.getFieldProps("question1")}
            />

            <label>Do you have impact resistant windows?</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
              name="question2"
              {...formik.getFieldProps("question2")}
            />

            <label>Are you stocked up on the necessary food, water and practical items?</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
              name="question3"
              {...formik.getFieldProps("question3")}
            />

            <label>Do you have a way to shield your car and home from potential debris?</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
              name="question4"
              {...formik.getFieldProps("question4")}
            />

            <label>Have you been in a tropical storm or hurricane before?</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
              name="question5"
              {...formik.getFieldProps("question5")}
            />

            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-dark focus:outline-none my-1"
              onClick= {e => formik.resetForm()}
            >
              Get Resources 
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default BasicForm;