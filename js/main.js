const app = new Vue({
    el: "#app", 
    data: {
        courses: [], 
        newCourse: { }, 
        displayForm: false, 
        displayProducts: false,
        loading: false
    }, 
    methods: {
        add: function(){
            this.ajax("/course/add", this.newCourse).then(function() {
                this.courses.push(this.newCourse)
                this.initForm()
            })
        }, 
        initForm: function(){
            this.newCourse = {
                name: "",
                category: "", 
                quantity: "", 
                prix: "", 
                prixKilo: "", 
                marque: "", 
                grocery:"",
                desc: ""
            }
        }, 
        ajax: function(url, params = { } ) {
            this.loading= true
            let s = url+"?";
            for(let key in params) {
                s += key + "=" + encodeURIComponent(params[key]) +"&"
            }
            setTimeout(() => {
                this.loading= false
            },1200)
            return this.$http.get(s);
        },
        edit: function (event) {
            let input = event.target.querySelector("input")
            input.classList.remove("disabled")
            input.focus()
        },
        validate: function (event, object, key, value) {
            let o = new Object()
            o._id = object._id
            o[key] = value
            this.ajax("/course/update", o)
            .then (() => {
                let input= event.target
                input.classList.add("disabled")
                input.blur()
            })
        }
    }, 
     
    computed: {
        selectedCourses: function() {
            return this.courses.filter((course) => { return course.quantity })
        }
    },
    mounted: function () {
        this.$http.get("/course/list").then(function (response) {
            this.courses = response.body
        })
        this.initForm()
    }
})